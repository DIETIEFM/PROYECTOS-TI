# ERP Excellence Freights — Sitio / menú principal

Primer proyecto del repositorio: sitio web que funciona como menú de entrada al ERP, con las áreas **Operaciones, Finanzas, Mantenimiento, Compras y Gerencial**.

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
├── index.html              Inicio: tarjetas de las 5 áreas
├── operaciones/index.html  Página de cada área (lista de módulos)
├── finanzas/index.html
├── mantenimiento/index.html
├── compras/index.html
├── gerencial/index.html
└── assets/
    ├── css/erp.css         Estilos (usa variables --ef-* de la identidad corporativa)
    └── js/menu.js          Configuración del menú (AREAS) y generación de páginas
```

## Cómo modificar el menú

Todo el menú sale del arreglo `AREAS` en `assets/js/menu.js`: encabezado, barra lateral, tarjetas de inicio y lista de módulos de cada área.

- **Agregar o quitar un módulo:** edita la lista `modulos` del área.
- **Agregar un área nueva:** añade un objeto a `AREAS` y crea `erp/<id>/index.html` copiando el de otra área y cambiando `data-area="<id>"`.

Por ahora los módulos aparecen como **"Próximamente"**; son una propuesta inicial que se irá desarrollando uno por uno.
