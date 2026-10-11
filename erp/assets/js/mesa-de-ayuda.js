// Excellence Freights ERP — Mesa de ayuda de TI
// Sin servidor todavía: el reporte se envía por correo al buzón de TI y se
// guarda un historial local en el navegador del usuario.

// Buzón que recibe los reportes. Cámbialo aquí si TI usa otra dirección.
const CORREO_TI = "ti@excellencef.com.mx";

const CATEGORIAS = {
  sistema: {
    nombre: "Error en sistema",
    objeto: "¿Qué sistema o programa? *",
    ejemplo: "Ej. ERP, Outlook, Excel, internet",
    tipos: [
      "No puedo entrar / contraseña",
      "Aparece un mensaje de error",
      "El sistema está lento o se congela",
      "Sin internet o sin red",
      "Correo electrónico",
      "Instalar o actualizar un programa",
      "Otro",
    ],
  },
  impresora: {
    nombre: "Error en impresora",
    objeto: "¿Qué impresora o dónde está? *",
    ejemplo: "Ej. HP de recepción, Epson de operaciones",
    tipos: [
      "No imprime",
      "Atasco de papel",
      "Sin tóner o tinta",
      "Imprime con mala calidad",
      "No escanea",
      "No aparece en mi computadora",
      "Otro",
    ],
  },
  equipo: {
    nombre: "Falla en equipo de cómputo",
    objeto: "¿Qué equipo? *",
    ejemplo: "Ej. laptop Dell, número de inventario o nombre del equipo",
    tipos: [
      "No enciende",
      "Muy lento",
      "Pantalla azul o se reinicia solo",
      "Monitor sin imagen o dañado",
      "Teclado o mouse no funcionan",
      "Posible virus",
      "Daño físico (golpe, líquido)",
      "Otro",
    ],
  },
};

const CLAVE_HISTORIAL = "ef-mesa-ayuda-historial";
const CLAVE_DATOS = "ef-mesa-ayuda-datos";

const form = document.getElementById("form-reporte");
const selectTipo = form.elements.tipo;
const confirmacion = document.getElementById("confirmacion");

// ---------- Almacenamiento local (puede no estar disponible) ----------
function leer(clave, porDefecto) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}
function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento: el reporte igual se envía por correo */
  }
}

// ---------- Categoría ----------
function elegirCategoria(id) {
  const cat = CATEGORIAS[id];
  selectTipo.innerHTML = '<option value="">Selecciona…</option>' +
    cat.tipos.map((t) => `<option>${t}</option>`).join("");
  document.getElementById("etiqueta-objeto").textContent = cat.objeto;
  form.elements.objeto.placeholder = cat.ejemplo;
  document.getElementById("bloque-detalle").disabled = false;
  document.getElementById("bloque-contacto").disabled = false;
  document.getElementById("error-categoria").hidden = true;
}

form.querySelectorAll('input[name="categoria"]').forEach((radio) =>
  radio.addEventListener("change", () => elegirCategoria(radio.value)));

// Recordar los datos de contacto para el siguiente reporte.
const datosPrevios = leer(CLAVE_DATOS, {});
["nombre", "area", "contacto", "ubicacion"].forEach((campo) => {
  if (datosPrevios[campo]) form.elements[campo].value = datosPrevios[campo];
});

// ---------- Envío ----------
function generarFolio(fecha) {
  const p = (n) => String(n).padStart(2, "0");
  const aleatorio = p(Math.floor(Math.random() * 100));
  return `TI-${fecha.getFullYear()}${p(fecha.getMonth() + 1)}${p(fecha.getDate())}-${p(fecha.getHours())}${p(fecha.getMinutes())}${aleatorio}`;
}

function textoReporte(r) {
  return [
    `REPORTE MESA DE AYUDA — FOLIO ${r.folio}`,
    `Fecha: ${r.fecha}`,
    "",
    `Tipo: ${r.categoria}`,
    `Falla: ${r.tipo}`,
    `Sistema / equipo: ${r.objeto}`,
    `Prioridad: ${r.prioridad}`,
    "",
    "Descripción:",
    r.descripcion,
    "",
    `Reporta: ${r.nombre}`,
    `Área: ${r.area}`,
    `Contacto: ${r.contacto}`,
    `Ubicación: ${r.ubicacion || "—"}`,
  ].join("\n");
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const categoria = form.elements.categoria.value;
  if (!categoria) {
    document.getElementById("error-categoria").hidden = false;
    form.querySelector('input[name="categoria"]').focus();
    return;
  }
  if (!form.reportValidity()) return;

  const ahora = new Date();
  const d = Object.fromEntries(new FormData(form));
  const reporte = {
    folio: generarFolio(ahora),
    fecha: ahora.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }),
    categoria: CATEGORIAS[categoria].nombre,
    tipo: d.tipo,
    objeto: d.objeto.trim(),
    prioridad: d.prioridad,
    descripcion: d.descripcion.trim(),
    nombre: d.nombre.trim(),
    area: d.area,
    contacto: d.contacto.trim(),
    ubicacion: d.ubicacion.trim(),
  };

  guardar(CLAVE_DATOS, { nombre: reporte.nombre, area: reporte.area, contacto: reporte.contacto, ubicacion: reporte.ubicacion });
  guardar(CLAVE_HISTORIAL, [reporte, ...leer(CLAVE_HISTORIAL, [])].slice(0, 50));

  const asunto = `[Mesa de ayuda] ${reporte.folio} · ${reporte.prioridad} · ${reporte.categoria}: ${reporte.tipo}`;
  const texto = textoReporte(reporte);
  const mailto = `mailto:${CORREO_TI}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`;

  document.getElementById("conf-folio").textContent = reporte.folio;
  document.getElementById("conf-correo").textContent = CORREO_TI;
  document.getElementById("conf-mailto").href = mailto;
  document.getElementById("conf-texto").textContent = texto;
  form.hidden = true;
  confirmacion.hidden = false;
  confirmacion.focus();
  renderHistorial();

  window.location.href = mailto;
});

document.getElementById("conf-copiar").addEventListener("click", async (evento) => {
  const boton = evento.currentTarget;
  try {
    await navigator.clipboard.writeText(document.getElementById("conf-texto").textContent);
    boton.textContent = "¡Copiado!";
  } catch {
    // Sin permiso de portapapeles: seleccionar el texto para copiarlo a mano.
    const rango = document.createRange();
    rango.selectNodeContents(document.getElementById("conf-texto"));
    getSelection().removeAllRanges();
    getSelection().addRange(rango);
    boton.textContent = "Texto seleccionado: usa Ctrl+C";
  }
  setTimeout(() => (boton.textContent = "Copiar reporte"), 2500);
});

document.getElementById("conf-nuevo").addEventListener("click", () => {
  const { nombre, area, contacto, ubicacion } = form.elements;
  const conservar = [nombre.value, area.value, contacto.value, ubicacion.value];
  form.reset();
  [nombre.value, area.value, contacto.value, ubicacion.value] = conservar;
  selectTipo.innerHTML = "";
  document.getElementById("bloque-detalle").disabled = true;
  document.getElementById("bloque-contacto").disabled = true;
  confirmacion.hidden = true;
  form.hidden = false;
  form.querySelector('input[name="categoria"]').focus();
});

// ---------- Historial ----------
function renderHistorial() {
  const historial = leer(CLAVE_HISTORIAL, []);
  const tabla = document.getElementById("historial-tabla");
  document.getElementById("historial-vacio").hidden = historial.length > 0;
  tabla.hidden = historial.length === 0;
  const cuerpo = tabla.querySelector("tbody");
  cuerpo.replaceChildren(...historial.map((r) => {
    const fila = document.createElement("tr");
    [r.folio, r.fecha, r.categoria, r.tipo, r.prioridad].forEach((valor, i) => {
      const celda = document.createElement("td");
      celda.textContent = valor;
      if (i === 4) celda.className = `prioridad prioridad-${String(valor).toLowerCase()}`;
      fila.append(celda);
    });
    return fila;
  }));
}

renderHistorial();
