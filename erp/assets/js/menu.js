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
    descripcion: "Indicadores, reportes y administración.",
    icono: "chart",
    modulos: [
      { nombre: "Tablero de indicadores", descripcion: "KPIs de operación, finanzas y flotilla." },
      { nombre: "Rentabilidad", descripcion: "Utilidad por viaje, cliente y unidad." },
      { nombre: "Reportes", descripcion: "Reportes consolidados de todas las áreas." },
      { nombre: "Usuarios y permisos", descripcion: "Accesos por área y por puesto." },
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
      { nombre: "Usuarios y accesos", descripcion: "Altas, bajas y contraseñas de sistemas." },
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
};

function icono(nombre) {
  return `<svg class="icono" viewBox="0 0 24 24" aria-hidden="true">${ICONOS[nombre]}</svg>`;
}

function renderLayout() {
  const body = document.body;
  const base = body.dataset.base || "";
  const areaActual = body.dataset.area || "";
  const area = AREAS.find((a) => a.id === areaActual);

  const enlaces = [{ id: "", nombre: "Inicio", icono: "home", href: `${base}index.html` }]
    .concat(AREAS.map((a) => ({ ...a, href: `${base}${a.id}/index.html` })))
    .map((a) => `
      <a class="menu-enlace${a.id === areaActual ? " activo" : ""}" href="${a.href}"${a.id === areaActual ? ' aria-current="page"' : ""}>
        ${icono(a.icono)}<span>${a.nombre}</span>
      </a>`)
    .join("");

  body.insertAdjacentHTML("afterbegin", `
    <header class="encabezado">
      <button class="boton-menu" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-lateral">${icono("menu")}</button>
      <a class="encabezado-logo" href="${base}index.html">
        <img src="${base}../identidad-corporativa/logos/excellence-freights-logo-negativo.png" alt="Excellence Freights">
      </a>
      <span class="encabezado-titulo">ERP</span>
    </header>
    <nav class="menu-lateral" id="menu-lateral" aria-label="Menú principal">
      <p class="menu-etiqueta">Áreas</p>
      ${enlaces}
    </nav>
  `);

  // Las páginas con contenido propio (p. ej. Mesa de ayuda) traen su <main> lleno.
  const main = document.querySelector("main");
  if (!main.children.length) {
    main.innerHTML = area ? renderArea(area, base) : renderInicio(base);
  }

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

function renderInicio(base) {
  const tarjetas = AREAS.map((a) => `
    <a class="tarjeta" href="${base}${a.id}/index.html">
      <span class="tarjeta-icono">${icono(a.icono)}</span>
      <h2>${a.nombre}</h2>
      <p>${a.descripcion}</p>
      <span class="tarjeta-accion">Entrar ${icono("arrow")}</span>
    </a>`).join("");

  return `
    <p class="etiqueta">Excellence Freights</p>
    <h1>Sistema ERP</h1>
    <p class="intro">Selecciona el área con la que quieres trabajar.</p>
    <div class="rejilla">${tarjetas}</div>`;
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
