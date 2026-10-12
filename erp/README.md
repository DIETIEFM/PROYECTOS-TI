# ERP Excellence Freights — Sitio / menú principal

Primer proyecto del repositorio: sitio web que funciona como menú de entrada al ERP, con las áreas **Operaciones, Finanzas, Mantenimiento, Compras, Gerencial y TI**.

## Cómo verlo en tu computadora

No necesitas instalar nada: es HTML, CSS y JavaScript puro.

1. **Descarga el proyecto.** En GitHub abre el repositorio `DIETIEFM/PROYECTOS-TI` y selecciona la rama donde está el ERP en el selector de ramas (arriba a la izquierda). Luego da clic en el botón verde **`<> Code`** → **Download ZIP**.
2. **Descomprime el ZIP.** En el Explorador de archivos, clic derecho sobre el ZIP → **Extraer todo…** → **Extraer**.
3. **Abre la página.** Dentro de la carpeta extraída entra a `erp` y da **doble clic en `index.html`**. Se abre en tu navegador (Chrome, Edge, etc.) y te pide usuario y contraseña.

> No muevas `index.html` ni la carpeta `erp` fuera del proyecto: la página toma los logos y colores de la carpeta `identidad-corporativa`, que está al mismo nivel.

Las fuentes de respaldo (Montserrat y Barlow Condensed) se descargan de Google Fonts. Sin internet, la página igual funciona pero con la letra estándar del sistema.

### Opción para desarrolladores (servidor local)

Si tienes Python instalado, desde la carpeta raíz del proyecto (la que contiene `erp` e `identidad-corporativa`):

```bash
python3 -m http.server 8000
# abrir http://localhost:8000/erp/
```

## Control de acceso

Al abrir cualquier página del ERP se pide **usuario y contraseña** (`erp/login.html`).

- **Primer acceso:** el usuario entra con la contraseña temporal que le dio TI y el sistema lo obliga a cambiarla antes de continuar. La nueva debe tener al menos 8 caracteres, una letra y un número.
- **Permisos:** se toman de la columna `Modulo` del Excel, que corresponde a los encabezados de las áreas del menú.
  - Los usuarios del grupo **TI son administradores**: entran a todas las áreas y módulos, incluida *TI → Usuarios y accesos*, que es el único lugar donde se administran los accesos.
  - Los demás usuarios solo ven y entran al área de su encabezado y a los módulos dentro de ella. Si abren otra área, incluso escribiendo la dirección, ven "Sin permiso".
  - La **Mesa de ayuda** está disponible para todos.
  - Todo módulo nuevo hereda el permiso del área donde se crea (atributo `data-area` de su página).
- **Seguridad:** tras 5 intentos fallidos el usuario se bloquea 5 minutos. La sesión se cierra sola después de 30 minutos sin actividad o con el botón **Salir**. Cualquier usuario puede cambiar su contraseña desde el botón **Contraseña** del encabezado.
- **Usuarios:** salen del Excel de control de acceso (columnas `Modulo`, `Usuario`, `Password`). Para actualizarlos:

  ```bash
  python3 herramientas/generar_usuarios.py ruta/usuarios.xlsx
  ```

  Esto regenera `erp/assets/js/usuarios.js` con las contraseñas cifradas (PBKDF2-SHA256), nunca en texto. **El Excel no se sube al repositorio** (`.gitignore` lo excluye).

> **Importante: es una versión de prueba sin servidor.** Todo se valida en el navegador, así que sirve para definir y probar el flujo, pero no protege información real: quien tenga los archivos puede saltarse el acceso. Además, la contraseña nueva solo queda guardada en el navegador donde se cambió (en otra computadora sigue funcionando la temporal). Para uso real hace falta un servidor con base de datos; las funciones de `assets/js/auth.js` están separadas para reemplazarlas en ese momento.

## Estructura

```
erp/
├── login.html              Inicio de sesión
├── cambiar-contrasena.html Cambio de contraseña (obligatorio en el primer acceso)
├── index.html              Inicio: tarjetas de las áreas permitidas
├── operaciones/index.html  Página de cada área (lista de módulos)
├── operaciones/unidades/   Tractocamiones, tanques y dollys
├── operaciones/productos-quimicos/
├── operaciones/rutas/
├── finanzas/index.html
├── mantenimiento/index.html
├── compras/index.html
├── gerencial/index.html
├── ti/index.html
├── ti/mesa-de-ayuda/       Mesa de ayuda (disponible para todos)
├── ti/usuarios/            Usuarios y accesos (solo TI)
└── assets/
    ├── css/erp.css         Estilos (usa variables --ef-* de la identidad corporativa)
    ├── css/mesa-de-ayuda.css
    ├── css/acceso.css      Pantallas de inicio de sesión y contraseña
    ├── css/catalogos.css   Listas y formularios de catálogos
    ├── js/usuarios.js      Usuarios con contraseñas cifradas (generado desde el Excel)
    ├── js/auth.js          Control de acceso: sesión, contraseñas y permisos
    ├── js/menu.js          Configuración del menú (AREAS) y generación de páginas
    ├── js/catalogos.js     Pantalla genérica de catálogos (lista, formulario, Excel)
    ├── js/catalogos-operaciones.js  Campos de los catálogos de Operaciones
    └── js/mesa-de-ayuda.js Formulario de reportes
```

## Cómo modificar el menú

Todo el menú sale del arreglo `AREAS` en `assets/js/menu.js`: encabezado, barra lateral, tarjetas de inicio y lista de módulos de cada área.

- **Agregar o quitar un módulo:** edita la lista `modulos` del área. Si el módulo ya tiene página, agrégale `href` (relativo a la carpeta del área) y la tarjeta mostrará **Abrir** en lugar de "Próximamente".
- **Agregar un área nueva:** añade un objeto a `AREAS` y crea `erp/<id>/index.html` copiando el de otra área y cambiando `data-area="<id>"`.

Los módulos sin página aparecen como **"Próximamente"**; son una propuesta inicial que se irá desarrollando uno por uno.

## Operaciones: catálogos

Ruta: **Operaciones** → **Unidades** (pestañas *Tractocamiones*, *Tanques* y *Dollys*), **Productos químicos** y **Rutas**.

Todos los catálogos funcionan igual:

- **Agregar / Editar / Eliminar** registros con un formulario. Los campos con * son obligatorios.
- **No se repite la clave:** número económico (unidades), nombre comercial (productos) o clave de ruta.
- **Buscar** en todos los campos, **filtrar** por estatus o clase de riesgo, y **ordenar** dando clic en el encabezado de cada columna.
- **Descargar Excel:** baja un archivo CSV que se abre en Excel. Sirve como respaldo y como plantilla.
- **Importar:** carga un CSV guardado desde Excel (separado por comas o punto y coma) con los mismos encabezados. Agrega los registros nuevos y actualiza los existentes según la clave. Las celdas vacías no borran datos.

| Catálogo | Clave | Datos principales |
|---|---|---|
| Tractocamiones | Número económico | Placas, marca, modelo, año, VIN, motor, permiso SCT, seguro y vencimiento, operador, estatus |
| Tanques | Número económico | Placas, tipo, capacidad, compartimentos, material, recubrimiento, prueba hidrostática, productos compatibles, estatus |
| Dollys | Número económico | Placas, marca, año, serie, ejes, estatus |
| Productos químicos | Nombre comercial | Nombre químico, número ONU, clase de riesgo, grupo de embalaje, clave SAT, densidad, unidad, material de tanque, hoja de seguridad, precauciones |
| Rutas | Clave de ruta | Origen, destino, cliente, distancia, tiempo, casetas, combustible, vía, restricciones para materiales peligrosos |

Los campos se definen en `assets/js/catalogos-operaciones.js`; para agregar o quitar un campo basta editar esa lista. La pantalla es la misma para todos (`assets/js/catalogos.js`), así que futuros catálogos (clientes, operadores, proveedores…) solo necesitan su definición.

> **Versión de prueba:** los registros se guardan en el navegador de cada computadora. Lo que captures en una no aparece en otra. Usa **Descargar Excel** para respaldar. Con un servidor central, todos verán la misma información.

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
