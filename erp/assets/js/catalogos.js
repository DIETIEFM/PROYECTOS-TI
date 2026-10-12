// Excellence Freights ERP — pantalla de catálogos (lista + formulario)
// Uso: <div class="catalogo" data-catalogos="tractocamiones,tanques"></div>
// Las definiciones de cada catálogo están en CATALOGOS (p. ej. catalogos-operaciones.js).
//
// VERSIÓN SIN SERVIDOR: los registros se guardan en el navegador de esta computadora.
// Usa "Descargar Excel" para respaldar o compartir, e "Importar" para cargar listas.

(() => {
  if (!document.body.classList.contains("autorizado")) return; // sin sesión o sin permiso

  // ---------- Almacenamiento ----------
  const claveDatos = (id) => `ef-catalogo-${id}`;
  function leerRegistros(id) {
    try {
      return JSON.parse(localStorage.getItem(claveDatos(id))) || [];
    } catch {
      return [];
    }
  }
  function guardarRegistros(id, registros) {
    try {
      localStorage.setItem(claveDatos(id), JSON.stringify(registros));
      return true;
    } catch {
      alert("No se pudo guardar: este navegador no permite almacenar datos o ya no tiene espacio.");
      return false;
    }
  }

  const nuevoId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const normal = (v) => String(v ?? "").trim().toLowerCase();
  const usuarioActual = () => (AUTH.obtenerSesion() || {}).usuario || "";

  function formatear(campo, valor) {
    if (valor === undefined || valor === null || valor === "") return "";
    if (campo.tipo === "fecha") {
      const [a, m, d] = String(valor).split("-");
      return d ? `${d}/${m}/${a}` : String(valor);
    }
    if (campo.tipo === "numero" && !campo.sinMiles && !isNaN(valor)) return Number(valor).toLocaleString("es-MX");
    return String(valor);
  }

  // ---------- CSV (se abre en Excel) ----------
  function aCsv(catalogo, registros) {
    const celda = (v) => {
      const t = String(v ?? "");
      return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
    };
    const filas = [catalogo.campos.map((c) => celda(c.etiqueta)).join(",")];
    registros.forEach((r) => filas.push(catalogo.campos.map((c) => celda(r[c.id])).join(",")));
    return "﻿" + filas.join("\r\n");
  }

  function leerCsv(texto) {
    texto = texto.replace(/^﻿/, "");
    const primera = texto.split(/\r?\n/, 1)[0];
    const sep = (primera.match(/;/g) || []).length > (primera.match(/,/g) || []).length ? ";" : ",";
    const filas = [];
    let fila = [], campo = "", comillas = false;
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (comillas) {
        if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
        else if (c === '"') comillas = false;
        else campo += c;
      } else if (c === '"') comillas = true;
      else if (c === sep) { fila.push(campo); campo = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && texto[i + 1] === "\n") i++;
        fila.push(campo); filas.push(fila); fila = []; campo = "";
      } else campo += c;
    }
    if (campo || fila.length) { fila.push(campo); filas.push(fila); }
    return filas.filter((f) => f.some((v) => v.trim() !== ""));
  }

  function descargar(nombreArchivo, contenido) {
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([contenido], { type: "text/csv;charset=utf-8" }));
    enlace.download = nombreArchivo;
    document.body.append(enlace);
    enlace.click();
    setTimeout(() => { URL.revokeObjectURL(enlace.href); enlace.remove(); }, 1000);
  }

  // ---------- Pantalla de un catálogo ----------
  function montarCatalogo(contenedor, id) {
    const cat = CATALOGOS[id];
    const columnas = cat.campos.filter((c) => c.enTabla);
    const campoFiltro = cat.campos.find((c) => c.filtro);
    const estado = { busqueda: "", filtro: "", orden: cat.clave, asc: true };

    contenedor.innerHTML = `
      <div class="catalogo-barra">
        <input type="search" class="catalogo-buscar" placeholder="Buscar en ${cat.nombre.toLowerCase()}…" aria-label="Buscar">
        ${campoFiltro ? `<select class="catalogo-filtro" aria-label="Filtrar por ${campoFiltro.etiqueta}">
          <option value="">${campoFiltro.etiqueta}: todos</option>
          ${campoFiltro.opciones.map((o) => `<option>${o}</option>`).join("")}
        </select>` : ""}
        <span class="catalogo-espacio"></span>
        <button type="button" class="boton boton-secundario" data-accion="importar" title="Archivo CSV guardado desde Excel">Importar</button>
        <button type="button" class="boton boton-secundario" data-accion="exportar">Descargar Excel</button>
        <button type="button" class="boton boton-primario" data-accion="nuevo">+ Agregar ${cat.singular}</button>
        <input type="file" accept=".csv,text/csv" class="catalogo-archivo" hidden>
      </div>
      <p class="catalogo-conteo" role="status"></p>
      <div class="tabla-envoltura">
        <table class="tabla catalogo-tabla">
          <thead><tr>
            ${columnas.map((c) => `<th><button type="button" class="orden" data-campo="${c.id}">${c.etiqueta}</button></th>`).join("")}
            <th class="col-acciones"><span class="solo-lectores">Acciones</span></th>
          </tr></thead>
          <tbody></tbody>
        </table>
      </div>
      <dialog class="catalogo-dialogo">
        <form method="dialog" class="catalogo-form" novalidate>
          <h2></h2>
          <div class="campos"></div>
          <p class="error" hidden></p>
          <div class="acciones">
            <button type="submit" class="boton boton-primario" value="guardar">Guardar</button>
            <button type="button" class="boton boton-secundario" data-accion="cancelar">Cancelar</button>
          </div>
        </form>
      </dialog>`;

    const $ = (sel) => contenedor.querySelector(sel);
    const cuerpo = $("tbody");
    const dialogo = $("dialog");
    const form = $(".catalogo-form");
    let editando = null;

    // ----- Lista -----
    function render() {
      const todos = leerRegistros(id);
      const q = normal(estado.busqueda);
      const visibles = todos
        .filter((r) => !estado.filtro || r[campoFiltro.id] === estado.filtro)
        .filter((r) => !q || cat.campos.some((c) => normal(r[c.id]).includes(q)))
        .sort((a, b) => {
          const campo = cat.campos.find((c) => c.id === estado.orden);
          let x = a[estado.orden] ?? "", y = b[estado.orden] ?? "";
          const cmp = campo.tipo === "numero" && x !== "" && y !== ""
            ? Number(x) - Number(y)
            : String(x).localeCompare(String(y), "es", { numeric: true, sensitivity: "base" });
          return estado.asc ? cmp : -cmp;
        });

      contenedor.querySelectorAll(".orden").forEach((b) => {
        b.parentElement.setAttribute("aria-sort", b.dataset.campo === estado.orden ? (estado.asc ? "ascending" : "descending") : "none");
      });

      $(".catalogo-conteo").textContent = todos.length === 0
        ? `Aún no hay ${cat.nombre.toLowerCase()} registrados. Da clic en "+ Agregar ${cat.singular}" o importa tu lista de Excel.`
        : `${visibles.length} de ${todos.length} ${cat.nombre.toLowerCase()}`;

      cuerpo.replaceChildren(...visibles.map((r) => {
        const fila = document.createElement("tr");
        columnas.forEach((c) => {
          const td = document.createElement("td");
          td.textContent = formatear(c, r[c.id]);
          if (c.id === "estatus") td.className = `estatus estatus-${normal(r[c.id]).replace(/\s+/g, "-")}`;
          if (c.id === cat.clave) td.classList.add("celda-clave");
          fila.append(td);
        });
        const acciones = document.createElement("td");
        acciones.className = "col-acciones";
        acciones.innerHTML = `
          <button type="button" class="boton-tabla" data-editar>Editar</button>
          <button type="button" class="boton-tabla boton-tabla-peligro" data-borrar>Eliminar</button>`;
        acciones.querySelector("[data-editar]").addEventListener("click", () => abrir(r));
        acciones.querySelector("[data-borrar]").addEventListener("click", () => borrar(r));
        fila.append(acciones);
        return fila;
      }));
    }

    // ----- Formulario -----
    function campoHtml(c) {
      const nombre = `name="${c.id}" id="${id}-${c.id}"${c.requerido ? " required" : ""}`;
      let control;
      if (c.tipo === "select") {
        control = `<select ${nombre}><option value="">Selecciona…</option>${c.opciones.map((o) => `<option>${o}</option>`).join("")}</select>`;
      } else if (c.tipo === "textarea") {
        control = `<textarea ${nombre} rows="3"></textarea>`;
      } else {
        const tipo = { numero: "number", fecha: "date" }[c.tipo] || "text";
        const extra = [
          c.min !== undefined ? `min="${c.min}"` : "",
          c.max !== undefined ? `max="${c.max}"` : "",
          c.tipo === "numero" ? `step="${c.paso || "1"}"` : "",
          c.patron ? `pattern="${c.patron}"` : "",
          c.ayuda ? `placeholder="${c.ayuda}"` : "",
        ].join(" ");
        control = `<input type="${tipo}" ${nombre} ${extra} autocomplete="off">`;
      }
      return `<label class="campo${c.tipo === "textarea" ? " campo-ancho" : ""}" for="${id}-${c.id}">
        <span>${c.etiqueta}${c.requerido ? " *" : ""}</span>${control}</label>`;
    }
    $(".campos").innerHTML = cat.campos.map(campoHtml).join("");

    function abrir(registro) {
      editando = registro || null;
      form.reset();
      form.querySelector(".error").hidden = true;
      form.querySelector("h2").textContent = registro ? `Editar ${cat.singular}` : `Agregar ${cat.singular}`;
      cat.campos.forEach((c) => {
        const control = form.elements[c.id];
        const valor = registro ? registro[c.id] ?? "" : (c.id === "estatus" ? c.opciones[0] : "");
        // Valor importado que no está en la lista: se agrega para no perderlo.
        if (c.tipo === "select" && valor && !c.opciones.includes(valor)) {
          control.add(new Option(valor, valor));
        }
        control.value = valor;
      });
      dialogo.showModal();
      form.elements[cat.campos[0].id].focus();
    }

    function mostrarError(msg) {
      const e = form.querySelector(".error");
      e.textContent = msg;
      e.hidden = false;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalido = cat.campos.map((c) => form.elements[c.id]).find((el) => !el.checkValidity());
      if (invalido) {
        const c = cat.campos.find((x) => x.id === invalido.name);
        mostrarError(invalido.validity.valueMissing ? `Falta llenar "${c.etiqueta}".`
          : `Revisa "${c.etiqueta}"${c.ayuda ? ` (${c.ayuda})` : ""}.`);
        invalido.focus();
        return;
      }
      const datos = {};
      cat.campos.forEach((c) => (datos[c.id] = form.elements[c.id].value.trim()));
      const registros = leerRegistros(id);
      const repetido = registros.find((r) => normal(r[cat.clave]) === normal(datos[cat.clave]) && (!editando || r.id !== editando.id));
      if (repetido) {
        const campoClave = cat.campos.find((c) => c.id === cat.clave);
        mostrarError(`Ya existe un registro con ${campoClave.etiqueta.toLowerCase()} "${datos[cat.clave]}".`);
        form.elements[cat.clave].focus();
        return;
      }
      const ahora = new Date().toISOString();
      if (editando) {
        const i = registros.findIndex((r) => r.id === editando.id);
        registros[i] = { ...registros[i], ...datos, actualizado: ahora, actualizadoPor: usuarioActual() };
      } else {
        registros.push({ id: nuevoId(), ...datos, creado: ahora, actualizado: ahora, actualizadoPor: usuarioActual() });
      }
      if (guardarRegistros(id, registros)) {
        dialogo.close();
        render();
      }
    });

    function borrar(registro) {
      if (!confirm(`¿Eliminar ${cat.singular} "${registro[cat.clave]}"? Esta acción no se puede deshacer.`)) return;
      guardarRegistros(id, leerRegistros(id).filter((r) => r.id !== registro.id));
      render();
    }

    // ----- Importar / exportar -----
    function exportar() {
      const fecha = new Date().toISOString().slice(0, 10);
      descargar(`${cat.nombre.replace(/\s+/g, "-").toLowerCase()}-${fecha}.csv`, aCsv(cat, leerRegistros(id)));
    }

    async function importar(archivo) {
      const filas = leerCsv(await archivo.text());
      if (filas.length < 2) return alert("El archivo no tiene registros.");
      const encabezados = filas[0].map(normal);
      const mapa = cat.campos.map((c) => {
        const i = encabezados.findIndex((h) => h === normal(c.etiqueta) || h === normal(c.id));
        return [c, i];
      }).filter(([, i]) => i >= 0);
      if (!mapa.some(([c]) => c.id === cat.clave)) {
        const campoClave = cat.campos.find((c) => c.id === cat.clave);
        return alert(`El archivo debe tener la columna "${campoClave.etiqueta}". Descarga el Excel de este catálogo para usarlo como plantilla.`);
      }
      const registros = leerRegistros(id);
      let nuevos = 0, actualizados = 0, omitidos = 0;
      const ahora = new Date().toISOString();
      filas.slice(1).forEach((fila) => {
        const datos = {};
        mapa.forEach(([c, i]) => (datos[c.id] = (fila[i] ?? "").trim()));
        if (!datos[cat.clave]) { omitidos++; return; }
        const existente = registros.find((r) => normal(r[cat.clave]) === normal(datos[cat.clave]));
        if (existente) {
          // Una celda vacía en el Excel no borra lo que ya estaba capturado.
          Object.keys(datos).forEach((k) => { if (datos[k] === "") delete datos[k]; });
          Object.assign(existente, datos, { actualizado: ahora, actualizadoPor: usuarioActual() });
          actualizados++;
        } else {
          const campoEstatus = cat.campos.find((c) => c.id === "estatus");
          if (campoEstatus && !datos.estatus) datos.estatus = campoEstatus.opciones[0];
          registros.push({ id: nuevoId(), ...datos, creado: ahora, actualizado: ahora, actualizadoPor: usuarioActual() });
          nuevos++;
        }
      });
      if (guardarRegistros(id, registros)) {
        render();
        alert(`Importación terminada: ${nuevos} nuevos, ${actualizados} actualizados${omitidos ? `, ${omitidos} filas sin ${cat.campos.find((c) => c.id === cat.clave).etiqueta.toLowerCase()} omitidas` : ""}.`);
      }
    }

    // ----- Eventos -----
    $(".catalogo-buscar").addEventListener("input", (e) => { estado.busqueda = e.target.value; render(); });
    if (campoFiltro) $(".catalogo-filtro").addEventListener("change", (e) => { estado.filtro = e.target.value; render(); });
    contenedor.querySelectorAll(".orden").forEach((b) => b.addEventListener("click", () => {
      estado.asc = estado.orden === b.dataset.campo ? !estado.asc : true;
      estado.orden = b.dataset.campo;
      render();
    }));
    $('[data-accion="nuevo"]').addEventListener("click", () => abrir(null));
    $('[data-accion="cancelar"]').addEventListener("click", () => dialogo.close());
    $('[data-accion="exportar"]').addEventListener("click", exportar);
    const archivo = $(".catalogo-archivo");
    $('[data-accion="importar"]').addEventListener("click", () => archivo.click());
    archivo.addEventListener("change", () => {
      if (archivo.files[0]) importar(archivo.files[0]);
      archivo.value = "";
    });

    render();
  }

  // ---------- Pestañas (cuando la página tiene varios catálogos) ----------
  document.querySelectorAll(".catalogo[data-catalogos]").forEach((raiz) => {
    const ids = raiz.dataset.catalogos.split(",").map((s) => s.trim()).filter((s) => CATALOGOS[s]);
    const panel = document.createElement("div");
    if (ids.length > 1) {
      const pestanas = document.createElement("div");
      pestanas.className = "pestanas";
      pestanas.setAttribute("role", "tablist");
      ids.forEach((cid) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "pestana";
        b.setAttribute("role", "tab");
        b.dataset.id = cid;
        b.textContent = CATALOGOS[cid].nombre;
        b.addEventListener("click", () => elegir(cid));
        pestanas.append(b);
      });
      raiz.append(pestanas);
    }
    raiz.append(panel);

    function elegir(cid) {
      raiz.querySelectorAll(".pestana").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.id === cid)));
      montarCatalogo(panel, cid);
      if (ids.length > 1) history.replaceState(null, "", `#${cid}`);
    }
    const inicial = location.hash.slice(1);
    elegir(ids.includes(inicial) ? inicial : ids[0]);
  });
})();
