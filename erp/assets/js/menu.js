// Excellence Freights ERP — menú principal
// Para agregar o cambiar opciones del menú, edita solo AREAS: el encabezado,
// la barra lateral, las tarjetas de inicio y las páginas de cada área se generan
// a partir de esta lista.

const AREAS = [
  {
    id: "operaciones",
    nombre: "Operaciones",
    descripcion: "Embarques, viajes, unidades y seguimiento de la carga.",
    icono: "truck",
    modulos: [
      { nombre: "Embarques y viajes", descripcion: "Alta y programación de viajes por cliente." },
      { nombre: "Asignación de unidades", descripcion: "Unidades y operadores disponibles por viaje." },
      { nombre: "Rastreo", descripcion: "Seguimiento del estatus y ubicación de la carga." },
      { nombre: "Clientes", descripcion: "Catálogo de clientes, rutas y tarifas." },
      { nombre: "Operadores", descripcion: "Expedientes, licencias y disponibilidad." },
      { nombre: "Carta Porte", descripcion: "Documentación de traslado por viaje." },
    ],
  },
  {
    id: "finanzas",
    nombre: "Finanzas",
    descripcion: "Facturación, cobranza, pagos y bancos.",
    icono: "money",
    modulos: [
      { nombre: "Facturación", descripcion: "Emisión de CFDI por viaje o servicio." },
      { nombre: "Cuentas por cobrar", descripcion: "Cartera de clientes y cobranza." },
      { nombre: "Cuentas por pagar", descripcion: "Pagos a proveedores y acreedores." },
      { nombre: "Bancos", descripcion: "Movimientos y conciliación bancaria." },
      { nombre: "Gastos de viaje", descripcion: "Anticipos y comprobación de operadores." },
      { nombre: "Contabilidad", descripcion: "Pólizas y cierres contables." },
    ],
  },
  {
    id: "mantenimiento",
    nombre: "Mantenimiento",
    descripcion: "Flotilla, órdenes de trabajo y refacciones.",
    icono: "wrench",
    modulos: [
      { nombre: "Flotilla", descripcion: "Catálogo de tractos, cajas y remolques." },
      { nombre: "Órdenes de trabajo", descripcion: "Reparaciones correctivas por unidad." },
      { nombre: "Mantenimiento preventivo", descripcion: "Programa por kilometraje o fecha." },
      { nombre: "Llantas", descripcion: "Control de llantas, posiciones y renovados." },
      { nombre: "Refacciones", descripcion: "Almacén y consumo de refacciones." },
      { nombre: "Combustible", descripcion: "Cargas y rendimiento por unidad." },
    ],
  },
  {
    id: "compras",
    nombre: "Compras",
    descripcion: "Requisiciones, órdenes de compra y proveedores.",
    icono: "cart",
    modulos: [
      { nombre: "Requisiciones", descripcion: "Solicitudes de compra de cada área." },
      { nombre: "Cotizaciones", descripcion: "Comparativo de precios entre proveedores." },
      { nombre: "Órdenes de compra", descripcion: "Emisión y autorización de compras." },
      { nombre: "Proveedores", descripcion: "Catálogo y evaluación de proveedores." },
      { nombre: "Recepción", descripcion: "Entrada de mercancía contra orden de compra." },
    ],
  },
  {
    id: "gerencial",
    nombre: "Gerencial",
    descripcion: "Indicadores, rentabilidad y reportes.",
    icono: "chart",
    modulos: [
      { nombre: "Tablero de indicadores", descripcion: "KPIs de operación, finanzas y flotilla." },
      { nombre: "Rentabilidad", descripcion: "Utilidad por viaje, cliente y unidad." },
      { nombre: "Reportes", descripcion: "Reportes consolidados de todas las áreas." },
    ],
  },
  {
    id: "ti",
    nombre: "TI",
    descripcion: "Soporte técnico, equipos de cómputo y sistemas.",
    icono: "monitor",
    modulos: [
      {
        nombre: "Mesa de ayuda",
        descripcion: "Reporta errores en sistemas, impresoras o equipos de cómputo.",
        href: "mesa-de-ayuda/index.html",
      },
      { nombre: "Inventario de equipos", descripcion: "Computadoras, impresoras y su asignación." },
      {
        nombre: "Usuarios y accesos",
        descripcion: "Usuarios del ERP, sus áreas y restablecimiento de contraseñas.",
        href: "usuarios/index.html",
      },
      { nombre: "Licencias y software", descripcion: "Control de licencias y vencimientos." },
    ],
  },
];

const ICONOS = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  truck: '<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v.01M18 15v.01"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7H6"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  headset: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="14" width="5" height="6" rx="1.5"/><rect x="17" y="14" width="5" height="6" rx="1.5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  salir: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
};

const MESA_AYUDA = { id: "mesa-de-ayuda", nombre: "Mesa de ayuda", icono: "headset", ruta: "ti/mesa-de-ayuda/index.html" };

function icono(nombre) {
  return `<svg class="icono" viewBox="0 0 24 24" aria-hidden="true">${ICONOS[nombre]}</svg>`;
}

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function renderLayout() {
  const body = document.body;
  const base = body.dataset.base || "";
  const areaActual = body.dataset.area || "";
  const area = AREAS.find((a) => a.id === areaActual);

  // ---------- Control de acceso ----------
  const sesion = AUTH.obtenerSesion();
  if (!sesion) {
    location.replace(`${base}login.html`);
    return;
  }
  if (sesion.debeCambiar) {
    location.replace(`${base}cambiar-contrasena.html`);
    return;
  }
  const paraTodos = body.dataset.acceso === "todos";
  const autorizado = paraTodos || !area || AUTH.puedeVerArea(sesion, area.id);
  const areasVisibles = AREAS.filter((a) => AUTH.puedeVerArea(sesion, a.id));
  const areaUsuario = AREAS.find((a) => a.id === sesion.area);
  const enMesa = body.dataset.titulo === MESA_AYUDA.nombre;

  const enlace = (id, nombre, iconoNombre, href, activo) => `
      <a class="menu-enlace${activo ? " activo" : ""}" href="${href}"${activo ? ' aria-current="page"' : ""}>
        ${icono(iconoNombre)}<span>${nombre}</span>
      </a>`;
  const enlaces = enlace("", "Inicio", "home", `${base}index.html`, !areaActual)
    + areasVisibles.map((a) => enlace(a.id, a.nombre, a.icono, `${base}${a.id}/index.html`, a.id === areaActual && !enMesa)).join("");

  body.insertAdjacentHTML("afterbegin", `
    <header class="encabezado">
      <button class="boton-menu" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-lateral">${icono("menu")}</button>
      <a class="encabezado-logo" href="${base}index.html">
        <img src="${base}../identidad-corporativa/logos/excellence-freights-logo-negativo.png" alt="Excellence Freights">
      </a>
      <span class="encabezado-titulo">ERP</span>
      <div class="usuario">
        <span class="usuario-datos">
          ${icono("user")}
          <span><strong>${escapar(sesion.usuario)}</strong><small>${escapar(areaUsuario ? areaUsuario.nombre : sesion.area)}${sesion.rol === "admin" ? " · Administrador" : ""}</small></span>
        </span>
        <a class="usuario-accion" href="${base}cambiar-contrasena.html" title="Cambiar contraseña">${icono("lock")}<span>Contraseña</span></a>
        <button class="usuario-accion" type="button" id="cerrar-sesion" title="Cerrar sesión">${icono("salir")}<span>Salir</span></button>
      </div>
    </header>
    <nav class="menu-lateral" id="menu-lateral" aria-label="Menú principal">
      <p class="menu-etiqueta">Áreas</p>
      ${enlaces}
      <p class="menu-etiqueta menu-etiqueta-separada">Soporte</p>
      ${enlace(MESA_AYUDA.id, MESA_AYUDA.nombre, MESA_AYUDA.icono, `${base}${MESA_AYUDA.ruta}`, enMesa)}
    </nav>
  `);

  // Las páginas con contenido propio (p. ej. Mesa de ayuda) traen su <main> lleno.
  const main = document.querySelector("main");
  if (!autorizado) {
    main.innerHTML = renderSinAcceso(base);
  } else if (!main.children.length) {
    main.innerHTML = area ? renderArea(area, base) : renderInicio(base, areasVisibles);
  }
  body.classList.add("autorizado");

  document.getElementById("cerrar-sesion").addEventListener("click", () => {
    AUTH.cerrarSesion();
    location.replace(`${base}login.html`);
  });

  const boton = document.querySelector(".boton-menu");
  boton.addEventListener("click", () => {
    const abierto = body.classList.toggle("menu-abierto");
    boton.setAttribute("aria-expanded", String(abierto));
  });
  main.addEventListener("click", () => {
    body.classList.remove("menu-abierto");
    boton.setAttribute("aria-expanded", "false");
  });

  const titulo = body.dataset.titulo || (area && area.nombre);
  document.title = `${titulo ? titulo + " · " : ""}ERP · Excellence Freights`;
}

function renderInicio(base, areasVisibles) {
  const tarjeta = (href, iconoNombre, nombre, descripcion) => `
    <a class="tarjeta" href="${href}">
      <span class="tarjeta-icono">${icono(iconoNombre)}</span>
      <h2>${nombre}</h2>
      <p>${descripcion}</p>
      <span class="tarjeta-accion">Entrar ${icono("arrow")}</span>
    </a>`;
  const tarjetas = areasVisibles.map((a) => tarjeta(`${base}${a.id}/index.html`, a.icono, a.nombre, a.descripcion)).join("")
    + (areasVisibles.some((a) => a.id === "ti") ? ""
      : tarjeta(`${base}${MESA_AYUDA.ruta}`, MESA_AYUDA.icono, MESA_AYUDA.nombre, "Reporta fallas en sistemas, impresoras o equipos de cómputo."));

  return `
    <p class="etiqueta">Excellence Freights</p>
    <h1>Sistema ERP</h1>
    <p class="intro">Selecciona el área con la que quieres trabajar.</p>
    <div class="rejilla">${tarjetas}</div>`;
}

function renderSinAcceso(base) {
  return `
    <p class="etiqueta">Acceso restringido</p>
    <h1>Sin permiso</h1>
    <p class="intro">Tu usuario no tiene acceso a esta área. Si lo necesitas, solicítalo a TI.</p>
    <a class="tarjeta-accion" href="${base}index.html">Volver al inicio ${icono("arrow")}</a>`;
}

function renderArea(area, base) {
  const modulos = area.modulos.map((m) => m.href ? `
    <a class="tarjeta" href="${base}${area.id}/${m.href}">
      <h2>${m.nombre}</h2>
      <p>${m.descripcion}</p>
      <span class="tarjeta-accion">Abrir ${icono("arrow")}</span>
    </a>` : `
    <article class="tarjeta tarjeta-modulo">
      <h2>${m.nombre}</h2>
      <p>${m.descripcion}</p>
      <span class="estado">Próximamente</span>
    </article>`).join("");

  return `
    <p class="etiqueta">Área</p>
    <h1>${area.nombre}</h1>
    <p class="intro">${area.descripcion}</p>
    <div class="rejilla">${modulos}</div>`;
}

renderLayout();
