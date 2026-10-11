# ERP Excellence Freights — Sitio / menú principal

Primer proyecto del repositorio: sitio web que funciona como menú de entrada al ERP, con las áreas **Operaciones, Finanzas, Mantenimiento, Compras, Gerencial y TI**.

## Cómo verlo en tu computadora

No necesitas instalar nada: es HTML, CSS y JavaScript puro.

1. **Descarga el proyecto.** En GitHub abre el repositorio `DIETIEFM/PROYECTOS-TI` y selecciona la rama donde está el ERP en el selector de ramas (arriba a la izquierda). Luego da clic en el botón verde **`<> Code`** → **Download ZIP**.
2. **Descomprime el ZIP.** En el Explorador de archivos, clic derecho sobre el ZIP → **Extraer todo…** → **Extraer**.
3. **Abre la página.** Dentro de la carpeta extraída entra a `erp` y da **doble clic en `index.html`**. Se abre en tu navegador (Chrome, Edge, etc.).

> No muevas `index.html` ni la carpeta `erp` fuera del proyecto: la página toma los logos y colores de la carpeta `identidad-corporativa`, que está al mismo nivel.

Las fuentes de respaldo (Montserrat y Barlow Condensed) se descargan de Google Fonts. Sin internet, la página igual funciona pero con la letra estándar del sistema.

### Opción para desarrolladores (servidor local)

Si tienes Python instalado, desde la carpeta raíz del proyecto (la que contiene `erp` e `identidad-corporativa`):

```bash
python3 -m http.server 8000
# abrir http://localhost:8000/erp/
```

## Estructura

```
erp/
├── index.html              Inicio: tarjetas de las 6 áreas
├── operaciones/index.html  Página de cada área (lista de módulos)
├── finanzas/index.html
├── mantenimiento/index.html
├── compras/index.html
├── gerencial/index.html
├── ti/index.html
├── ti/mesa-de-ayuda/       Mesa de ayuda (primer módulo funcional)
└── assets/
    ├── css/erp.css         Estilos (usa variables --ef-* de la identidad corporativa)
    ├── css/mesa-de-ayuda.css
    ├── js/menu.js          Configuración del menú (AREAS) y generación de páginas
    └── js/mesa-de-ayuda.js Formulario de reportes
```

## Cómo modificar el menú

Todo el menú sale del arreglo `AREAS` en `assets/js/menu.js`: encabezado, barra lateral, tarjetas de inicio y lista de módulos de cada área.

- **Agregar o quitar un módulo:** edita la lista `modulos` del área. Si el módulo ya tiene página, agrégale `href` (relativo a la carpeta del área) y la tarjeta mostrará **Abrir** en lugar de "Próximamente".
- **Agregar un área nueva:** añade un objeto a `AREAS` y crea `erp/<id>/index.html` copiando el de otra área y cambiando `data-area="<id>"`.

Los módulos sin página aparecen como **"Próximamente"**; son una propuesta inicial que se irá desarrollando uno por uno.

## Mesa de ayuda (TI)

Ruta: **TI → Mesa de ayuda**. Sirve para reportar:

- **Errores en sistema:** acceso o contraseña, mensajes de error, lentitud, internet o red, correo, instalación de programas.
- **Errores en impresora:** no imprime, atascos, tóner o tinta, mala calidad, escáner, impresora que no aparece.
- **Fallas en equipo de cómputo:** no enciende, lentitud, pantalla azul, monitor, teclado o mouse, virus, daño físico.

Cómo funciona por ahora (sin servidor):

1. El usuario elige el tipo de problema, la falla, la prioridad (Baja, Media o Alta) y sus datos de contacto.
2. Al enviar se genera un **folio** (`TI-AAAAMMDD-HHMMSS`) y se abre su programa de correo con el reporte dirigido al buzón de TI. El usuario solo da clic en *Enviar*.
3. El reporte queda en **"Mis reportes en este equipo"**. Ese historial vive en el navegador de esa computadora; TI no lo ve.

El buzón de destino se cambia en la constante `CORREO_TI`, al inicio de `assets/js/mesa-de-ayuda.js`, y los tipos de falla en `CATEGORIAS` del mismo archivo.

**Siguiente paso sugerido:** guardar los reportes en una base de datos central para que TI tenga una bandeja con estatus (Abierto → En proceso → Resuelto) y el usuario pueda consultar el avance de su folio.
