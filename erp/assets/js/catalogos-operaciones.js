// Excellence Freights ERP — catálogos del área de Operaciones
// Cada catálogo se define aquí: nombre, campo clave (no se repite) y campos del formulario.
// Tipos de campo: texto, numero, fecha, select, textarea.
// enTabla: el campo se muestra como columna en la lista.

const ESTATUS_UNIDAD = ["Disponible", "En viaje", "En mantenimiento", "Fuera de servicio"];

const CAMPOS_UNIDAD_BASE = [
  { id: "economico", etiqueta: "Número económico", tipo: "texto", requerido: true, enTabla: true },
  { id: "placas", etiqueta: "Placas", tipo: "texto", requerido: true, enTabla: true },
];

const CATALOGOS = {
  tractocamiones: {
    nombre: "Tractocamiones",
    singular: "tractocamión",
    clave: "economico",
    campos: [
      ...CAMPOS_UNIDAD_BASE,
      { id: "marca", etiqueta: "Marca", tipo: "select", enTabla: true,
        opciones: ["Kenworth", "Freightliner", "International", "Volvo", "Peterbilt", "Mack", "Otra"] },
      { id: "modelo", etiqueta: "Modelo", tipo: "texto" },
      { id: "anio", etiqueta: "Año", tipo: "numero", min: 1980, max: 2100, sinMiles: true, enTabla: true },
      { id: "serie", etiqueta: "Número de serie (VIN)", tipo: "texto" },
      { id: "motor", etiqueta: "Número de motor", tipo: "texto" },
      { id: "permisoSct", etiqueta: "Permiso SCT", tipo: "texto" },
      { id: "aseguradora", etiqueta: "Aseguradora", tipo: "texto" },
      { id: "poliza", etiqueta: "Póliza de seguro", tipo: "texto" },
      { id: "vencePoliza", etiqueta: "Vencimiento de póliza", tipo: "fecha" },
      { id: "operador", etiqueta: "Operador asignado", tipo: "texto", enTabla: true },
      { id: "estatus", etiqueta: "Estatus", tipo: "select", opciones: ESTATUS_UNIDAD, requerido: true, enTabla: true, filtro: true },
      { id: "notas", etiqueta: "Notas", tipo: "textarea" },
    ],
  },

  tanques: {
    nombre: "Tanques",
    singular: "tanque",
    clave: "economico",
    campos: [
      ...CAMPOS_UNIDAD_BASE,
      { id: "tipo", etiqueta: "Tipo", tipo: "select", enTabla: true,
        opciones: ["Semirremolque tanque", "Autotanque (pipa)", "Isotanque", "Otro"] },
      { id: "capacidad", etiqueta: "Capacidad (litros)", tipo: "numero", min: 0, enTabla: true },
      { id: "compartimentos", etiqueta: "Compartimentos", tipo: "numero", min: 1, max: 10, sinMiles: true },
      { id: "material", etiqueta: "Material del tanque", tipo: "select",
        opciones: ["Acero inoxidable", "Acero al carbón", "Aluminio", "Fibra de vidrio", "Otro"] },
      { id: "recubrimiento", etiqueta: "Recubrimiento interior", tipo: "texto" },
      { id: "marca", etiqueta: "Fabricante", tipo: "texto" },
      { id: "anio", etiqueta: "Año", tipo: "numero", min: 1980, max: 2100, sinMiles: true },
      { id: "serie", etiqueta: "Número de serie", tipo: "texto" },
      { id: "pruebaHidrostatica", etiqueta: "Última prueba hidrostática", tipo: "fecha", enTabla: true },
      { id: "productos", etiqueta: "Productos que puede transportar", tipo: "textarea" },
      { id: "estatus", etiqueta: "Estatus", tipo: "select", opciones: ESTATUS_UNIDAD, requerido: true, enTabla: true, filtro: true },
      { id: "notas", etiqueta: "Notas", tipo: "textarea" },
    ],
  },

  dollys: {
    nombre: "Dollys",
    singular: "dolly",
    clave: "economico",
    campos: [
      ...CAMPOS_UNIDAD_BASE,
      { id: "marca", etiqueta: "Marca", tipo: "texto", enTabla: true },
      { id: "anio", etiqueta: "Año", tipo: "numero", min: 1980, max: 2100, sinMiles: true, enTabla: true },
      { id: "serie", etiqueta: "Número de serie", tipo: "texto" },
      { id: "ejes", etiqueta: "Ejes", tipo: "select", opciones: ["1", "2"], enTabla: true },
      { id: "estatus", etiqueta: "Estatus", tipo: "select", opciones: ESTATUS_UNIDAD, requerido: true, enTabla: true, filtro: true },
      { id: "notas", etiqueta: "Notas", tipo: "textarea" },
    ],
  },

  productos: {
    nombre: "Productos químicos",
    singular: "producto",
    clave: "nombre",
    campos: [
      { id: "nombre", etiqueta: "Nombre comercial", tipo: "texto", requerido: true, enTabla: true },
      { id: "nombreQuimico", etiqueta: "Nombre químico", tipo: "texto", enTabla: true },
      { id: "onu", etiqueta: "Número ONU", tipo: "texto", patron: "\\d{4}", ayuda: "4 dígitos, p. ej. 1203", enTabla: true },
      { id: "clase", etiqueta: "Clase de riesgo", tipo: "select", enTabla: true, filtro: true,
        opciones: [
          "No peligroso",
          "1 Explosivos",
          "2.1 Gases inflamables",
          "2.2 Gases no inflamables, no tóxicos",
          "2.3 Gases tóxicos",
          "3 Líquidos inflamables",
          "4.1 Sólidos inflamables",
          "4.2 Combustión espontánea",
          "4.3 Peligrosos en contacto con agua",
          "5.1 Comburentes",
          "5.2 Peróxidos orgánicos",
          "6.1 Tóxicos",
          "6.2 Infecciosos",
          "7 Radiactivos",
          "8 Corrosivos",
          "9 Misceláneos",
        ] },
      { id: "grupoEmbalaje", etiqueta: "Grupo de embalaje", tipo: "select", opciones: ["I", "II", "III", "No aplica"], enTabla: true },
      { id: "claveSat", etiqueta: "Clave de producto SAT (Carta Porte)", tipo: "texto", patron: "\\d{8}", ayuda: "8 dígitos" },
      { id: "densidad", etiqueta: "Densidad (kg/L)", tipo: "numero", min: 0, paso: "0.001" },
      { id: "unidad", etiqueta: "Unidad de medida", tipo: "select", opciones: ["Litros", "Kilogramos", "Toneladas", "Metros cúbicos"] },
      { id: "materialTanque", etiqueta: "Material de tanque requerido", tipo: "select",
        opciones: ["Acero inoxidable", "Acero al carbón", "Aluminio", "Fibra de vidrio", "Cualquiera"] },
      { id: "hojaSeguridad", etiqueta: "Hoja de datos de seguridad (enlace o ubicación)", tipo: "texto" },
      { id: "precauciones", etiqueta: "Precauciones de manejo", tipo: "textarea" },
      { id: "estatus", etiqueta: "Estatus", tipo: "select", opciones: ["Activo", "Inactivo"], requerido: true, enTabla: true, filtro: true },
    ],
  },

  rutas: {
    nombre: "Rutas",
    singular: "ruta",
    clave: "clave",
    campos: [
      { id: "clave", etiqueta: "Clave de ruta", tipo: "texto", requerido: true, enTabla: true, ayuda: "p. ej. MEX-QRO-01" },
      { id: "origen", etiqueta: "Origen", tipo: "texto", requerido: true, enTabla: true },
      { id: "destino", etiqueta: "Destino", tipo: "texto", requerido: true, enTabla: true },
      { id: "cliente", etiqueta: "Cliente", tipo: "texto", enTabla: true },
      { id: "distancia", etiqueta: "Distancia (km)", tipo: "numero", min: 0, enTabla: true },
      { id: "tiempo", etiqueta: "Tiempo estimado (horas)", tipo: "numero", min: 0, paso: "0.5", enTabla: true },
      { id: "casetas", etiqueta: "Costo de casetas ($)", tipo: "numero", min: 0, paso: "0.01" },
      { id: "combustible", etiqueta: "Combustible estimado (litros)", tipo: "numero", min: 0 },
      { id: "via", etiqueta: "Vía / carreteras", tipo: "textarea" },
      { id: "restricciones", etiqueta: "Restricciones para materiales peligrosos", tipo: "textarea" },
      { id: "estatus", etiqueta: "Estatus", tipo: "select", opciones: ["Activa", "Inactiva"], requerido: true, enTabla: true, filtro: true },
    ],
  },
};
