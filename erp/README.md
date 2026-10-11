# ERP Excellence Freights — Sitio / menú principal

Primer proyecto del repositorio: sitio web que funciona como menú de entrada al ERP, con las áreas **Operaciones, Finanzas, Mantenimiento, Compras y Gerencial**.

## Cómo verlo

Es HTML, CSS y JavaScript puro, sin dependencias ni compilación. Desde la raíz del repositorio:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000/erp/
```

> Sírvelo desde la **raíz del repo** (no desde `erp/`), porque usa los logos y tokens de `identidad-corporativa/`.

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
