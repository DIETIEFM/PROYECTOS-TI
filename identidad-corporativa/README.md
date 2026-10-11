# Identidad corporativa — Excellence Freights

Resumen técnico del **Manual de Estilo EFM** (elaborado por Zurdo y Diestro) para aplicarlo en desarrollos de software, sitios web, reportes y documentos.

![Logo Excellence Freights](logos/excellence-freights-logo-color.png)

## Contenido

| Ruta | Para qué sirve |
|---|---|
| `tokens/brand.css` | Variables CSS (`--ef-*`) y clases de jerarquía tipográfica |
| `tokens/brand.json` | Todos los valores (HEX, RGB, CMYK, Pantone, vinil) en formato legible por máquina |
| `tokens/tailwind.preset.js` | Preset de Tailwind con colores `ef-*` y fuentes |
| `logos/` | Logo full color, logo calado (fondo azul) y símbolo, en PNG extraídos del manual |

## La marca

- **Símbolo:** un *triskel* (elemento triple entrelazado) formado por dos líneas paralelas que evocan una carretera: "nuestro camino".
- **Logotipo:** "Excellence" en **BW Modelica Bold** y "FREIGHTS" en **Acumin Extended**, con kerning cuidado.
- **Versiones:**
  - **Full color** — la preferida (símbolo amarillo + texto azul) sobre fondo blanco o de color.
  - **Calada en blanco** — para fondos oscuros (texto blanco, símbolo amarillo sobre azul).
  - **Monocromática** — cuando hay limitaciones técnicas o de fondo; usar azul o negro.
- **Espacio libre:** `X` = distancia entre la base de "Freights" y la base de "Excellence". Dejar `X` libre alrededor de todo el logo; ningún elemento puede invadir esa zona.
- **Tamaños mínimos:** marca completa **30 mm × 16.33 mm**; símbolo / favicon **5 mm × 5 mm**.

## Sistema de color

**Primaria** — dominante en todas las presentaciones internas y externas. Principalmente azul, con amarillo como secundario.

| Color | HEX | RGB | CMYK | Pantone | Vinil Avery |
|---|---|---|---|---|---|
| **Azul** | `#0C5B72` | 13, 91, 114 | C90 M50 Y36 K25 | 643 C | Dark Teal 730 |
| **Amarillo** | `#FCB64C` | 252, 182, 76 | C0 M32 Y80 K0 | 136 C | Dark Yellow 250 |

**Secundaria** — complementaria, no identificadora. Úsala **con moderación (menos del 10 % de una pieza)**, como acento o cuando técnicamente se requieran colores adicionales.

| Color | HEX | RGB | CMYK | Pantone | Vinil Avery |
|---|---|---|---|---|---|
| **Rojo** | `#ED174F` | 237, 23, 79 | C0 M100 Y62 K0 | 192 C | Hibiscus Red 405 |
| **Gris** | `#919698` | 145, 150, 152 | C40 M30 Y30 K10 | 422 C | Light Ash Gray 825 |
| **Turquesa** | `#00ABCA` | 0, 171, 202 | C95 M2 Y20 K0 | 3125 C | Peacock Blue 645 |

**Tonos** (mezcla con blanco al 80 / 60 / 40 / 20 %):

| Color | 100 % | 80 % | 60 % | 40 % | 20 % |
|---|---|---|---|---|---|
| Azul | `#0C5B72` | `#3D7C8E` | `#6D9DAA` | `#9EBDC7` | `#CEDEE3` |
| Amarillo | `#FCB64C` | `#FDC570` | `#FDD394` | `#FEE2B7` | `#FEF0DB` |
| Rojo | `#ED174F` | `#F14572` | `#F47495` | `#F8A2B9` | `#FBD1DC` |
| Gris | `#919698` | `#A7ABAD` | `#BDC0C1` | `#D3D5D6` | `#E9EAEA` |
| Turquesa | `#00ABCA` | `#33BCD5` | `#66CDDF` | `#99DDEA` | `#CCEEF4` |

> Nota: el manual indica RGB 13, 91, 114 (= `#0D5B72`) y Web `#0C5B72` para el azul. Se toma `#0C5B72` como código web oficial; la diferencia es imperceptible.

## Tipografía

| Rol | Familia | Pesos | Diseñador | Fallback web |
|---|---|---|---|---|
| **Primaria** — textos y titulares | **BW Modelica** (sans geométrica, minimalista) | Regular, Bold | Alberto Romanos | Montserrat |
| **Secundaria** — acentos | **Acumin Variable Condensed** (privilegiar anchos condensados y jugar con pesos) | Condensed Extra Light, Condensed Black | Robert Slimbach | Barlow Condensed |

Ambas fuentes tienen licencia comercial y no están en este repositorio. Las versiones OpenType vienen en la carpeta `11 FONTS` de los entregables de la agencia. Si no están instaladas, usa los fallbacks indicados (disponibles en Google Fonts).

### Jerarquía tipográfica

| Nivel | Fuente | Tamaño / interlineado | Estilo |
|---|---|---|---|
| Pie de foto | BW Modelica | 6 pt / 9 pt | — |
| Texto | BW Modelica | 8 pt / 11 pt | — |
| Texto 2 | BW Modelica | 9 pt / 11 pt | — |
| Titulares | BW Modelica | 10 pt / 10 pt | MAYÚSCULAS |
| Subsección | BW Modelica | 16 pt / 16 pt | MAYÚSCULAS |
| Gran titular | BW Modelica | 34 pt / 30 pt | MAYÚSCULAS |
| Acento grande | Acumin Condensed Light + Black | 36 pt / 42 pt | MAYÚSCULAS |

Patrón visual del manual: etiqueta de sección en **amarillo** ("SECCIÓN 1") sobre un gran titular en **azul**, en mayúsculas y BW Modelica Bold.

## Datos de contacto (papelería)

Claveles 14, Colonia Bello Horizonte, Tultitlán, Estado de México, C.P. 54948 · 55 5864 6800 | 55 4161 6804 · ventas@excellencef.com.mx

## Archivos fuente

Los originales vectoriales (`.ai`, `.eps`, `.tiff`), las plantillas de PowerPoint y Word y las fuentes están en los entregables de la agencia (carpetas `00 EDITABLES` a `12 IMÁGENES`). Los PNG de `logos/` se extrajeron del PDF del manual a 600 dpi y sirven para web y apps. Para impresión, usa siempre los vectoriales originales.
