# PROYECTOS-TI — Excellence Freights

Repositorio de proyectos del área de TI de Excellence Freights.

## Identidad corporativa (obligatoria en todo desarrollo)

Toda interfaz, reporte, documento o presentación debe seguir la guía en `identidad-corporativa/README.md`. Reglas clave:

- **Colores:** el azul `#0C5B72` es dominante y el amarillo `#FCB64C` es el secundario principal. Rojo `#ED174F`, gris `#919698` y turquesa `#00ABCA` solo como acentos (menos del 10 % de una pieza).
- **Tipografía:** BW Modelica (Regular/Bold) para textos y titulares, con Montserrat como fallback web. Acumin Variable Condensed (Extra Light/Black) para acentos, con Barlow Condensed como fallback.
- **Titulares** en MAYÚSCULAS. Patrón de encabezado: etiqueta en amarillo y titular grande en azul.
- **Logo:** full color sobre fondo claro; versión calada en blanco sobre fondo oscuro o azul. Respeta el espacio libre y no deformes, recolorees ni agregues efectos.
- **Reutiliza los tokens** en lugar de escribir HEX sueltos: `identidad-corporativa/tokens/brand.css` (variables `--ef-*`), `tokens/tailwind.preset.js` (clases `ef-*`) o `tokens/brand.json`.
- Logos en `identidad-corporativa/logos/`.

## Control de acceso y datos sensibles

- Toda página nueva del ERP debe cargar `usuarios.js`, `auth.js` y `menu.js` (en ese orden) para quedar protegida por el inicio de sesión. Declara su área con `data-area`, o usa `data-acceso="todos"` si es para todos los usuarios.
- Nunca subas al repositorio contraseñas en texto ni los Excel de usuarios (`*.xlsx` está en `.gitignore`). Los usuarios se generan con `herramientas/generar_usuarios.py`.
- El control de acceso actual es un prototipo del lado del navegador; no lo presentes como seguridad real.

## Catálogos

- Para un catálogo nuevo (lista con alta, edición y baja), no hagas una pantalla desde cero: define sus campos en un archivo `catalogos-<area>.js` (ver `erp/assets/js/catalogos-operaciones.js`) y usa `<div class="catalogo" data-catalogos="...">` con `catalogos.js`.
