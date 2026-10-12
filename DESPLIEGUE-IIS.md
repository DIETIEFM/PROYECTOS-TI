# Publicar el ERP en el servidor IIS (Azure)

El ERP es un sitio **estático** (HTML, CSS, JavaScript e imágenes). No necesita .NET, PHP ni base de datos para mostrarse, así que se publica en el **servidor IIS**. El servidor de SQL no se usa por ahora; servirá cuando el ERP tenga su base de datos central.

## ⚠️ Antes de publicar en internet

El inicio de sesión actual es un **prototipo que se valida en el navegador**:

- Cualquiera que llegue a la página puede descargar los archivos y saltarse el acceso.
- `erp/assets/js/usuarios.js` contiene las huellas de las contraseñas temporales. Son números de 6 dígitos, así que se pueden adivinar por fuerza bruta.
- Lo que se captura (catálogos, reportes) se guarda en el navegador de cada persona, no en el servidor.

**Recomendación:** mientras no exista el servidor de datos y el inicio de sesión real, **no lo dejes abierto a todo internet**. Limita el acceso con una de estas opciones (ver paso 6):

1. **Restricción por IP:** solo la IP pública de la oficina (y la VPN, si existe).
2. **Autenticación de Windows o básica en IIS:** el navegador pide usuario de Windows o del dominio antes de mostrar la página.
3. **Regla del NSG de Azure:** el puerto 80/443 solo abierto para las IP de la empresa.

## 1. Preparar los archivos

En tu computadora:

1. Descarga el ZIP: `https://github.com/DIETIEFM/PROYECTOS-TI/archive/refs/heads/claude/github-repository-o927hy.zip`
2. Descomprímelo. Dentro de la carpeta deben verse: `erp`, `identidad-corporativa`, `index.html`, `web.config` (y otros archivos que no estorban).

## 2. Copiar al servidor IIS

1. Conéctate al servidor IIS por **Escritorio remoto (RDP)**.
2. Crea la carpeta `C:\inetpub\erp-excellence`.
3. Copia **todo el contenido** de la carpeta descomprimida ahí, de modo que quede:

   ```
   C:\inetpub\erp-excellence\
   ├── index.html                ← lleva al inicio de sesión del ERP
   ├── web.config                ← configuración de IIS
   ├── erp\
   └── identidad-corporativa\
   ```

   Las carpetas `erp` e `identidad-corporativa` deben quedar **juntas**: el ERP toma de ahí los logos y colores.

> Para copiar puedes arrastrar el ZIP a la ventana del Escritorio remoto (con "Unidades locales" activado en la conexión) o descargarlo directo en el servidor con el navegador.

## 3. Crear el sitio en IIS

1. Abre **Administrador de Internet Information Services (IIS)** (`inetmgr`).
2. Clic derecho en **Sitios** → **Agregar sitio web…**
   - **Nombre del sitio:** `ERP Excellence`
   - **Ruta de acceso física:** `C:\inetpub\erp-excellence`
   - **Enlace:** tipo `http`, IP *Todas las no asignadas*, puerto `80`. En **Nombre de host** pon el dominio si tienes uno (p. ej. `erp.excellencef.com.mx`); si no, déjalo vacío.
3. Aceptar.

> Si ya existe otro sitio en el puerto 80 sin nombre de host (como *Default Web Site*), hay conflicto. Usa un **nombre de host**, otro puerto (p. ej. `8080`), o crea el ERP como **aplicación** dentro del sitio existente: clic derecho en el sitio → *Agregar aplicación…* → alias `erp`, misma ruta física.

El archivo `web.config` ya configura:

- `index.html` como página de inicio.
- **Bloqueo** de la carpeta `herramientas`, de archivos `.xlsx`, `.csv`, `.py`, `.md` y `.pdf` (para que nunca se publique por error una lista de usuarios o un documento interno).
- Encabezados básicos de seguridad.
- Que los navegadores tomen siempre la versión más reciente.

## 4. Abrir el puerto en Azure y en Windows

1. **Azure Portal** → la máquina virtual de IIS → **Redes** (*Networking*) → **Agregar regla de puerto de entrada**:
   - Puerto de destino: `80` (y `443` cuando tengas HTTPS)
   - Protocolo: TCP
   - **Origen:** de preferencia *Direcciones IP* con la IP pública de la oficina (ver recomendación arriba). Usa *Any* solo si de verdad debe verse desde cualquier lugar.
2. En el servidor, **Firewall de Windows Defender** → Reglas de entrada → verifica que **"World Wide Web Services (HTTP Traffic-In)"** esté habilitada (y la de HTTPS cuando aplique).

## 5. Probar

Desde una computadora fuera del servidor abre:

- `http://IP-PÚBLICA-DEL-SERVIDOR/` (la IP aparece en Azure Portal → la VM → *Información general*), o
- `http://erp.excellencef.com.mx/` si configuraste dominio.

Debe aparecer la pantalla de **Iniciar sesión** del ERP.

## 6. Limitar el acceso (recomendado)

**Opción A: restricción por IP en IIS**

1. *Administrar características de Windows* → Servidor web (IIS) → Seguridad → instalar **Restricciones de IP y dominio**.
2. En IIS selecciona el sitio → **Restricciones de direcciones IP y dominios** → *Editar configuración de características* → acceso para clientes no especificados: **Denegar**.
3. **Agregar entrada de permiso** con la IP pública de la oficina.

**Opción B: autenticación de Windows / básica**

1. Instala la característica **Autenticación de Windows** (o **Autenticación básica**).
2. En el sitio → **Autenticación** → deshabilita *Autenticación anónima* y habilita la que elegiste.
3. Con autenticación básica, usa siempre HTTPS (paso 7), porque las credenciales viajan en cada petición.

## 7. HTTPS (candado) con certificado gratuito

Requiere un **dominio** apuntando a la IP del servidor (registro **A** en tu DNS, p. ej. `erp.excellencef.com.mx` → IP pública).

1. Abre el puerto **443** en Azure (paso 4).
2. Descarga **win-acme** (`https://www.win-acme.com`) en el servidor y ejecuta `wacs.exe`.
3. Elige *Create certificate (default settings)* → selecciona el sitio **ERP Excellence**. win-acme obtiene el certificado de Let's Encrypt, crea el enlace HTTPS en IIS y programa la renovación automática.

## Actualizar el sitio después de cambios

1. Descarga el ZIP nuevo y descomprímelo.
2. Copia y **reemplaza** las carpetas `erp` e `identidad-corporativa` y los archivos `index.html` y `web.config` en `C:\inetpub\erp-excellence`.
3. No hace falta reiniciar IIS.

## Siguiente etapa: usar el servidor de SQL

Para que la información sea **compartida entre todas las computadoras** y el inicio de sesión sea **seguro de verdad**:

- Una **API** en el servidor IIS (por ejemplo ASP.NET Core, que IIS ejecuta de forma nativa) que valide usuarios y guarde y lea los datos.
- Las tablas en **SQL Server** (usuarios, unidades, productos, rutas, reportes de mesa de ayuda…).
- El servidor de SQL **sin exposición a internet**: solo accesible desde el servidor IIS por la red privada de Azure.

El código del ERP ya está separado para ese cambio (`auth.js` para el acceso y `catalogos.js` para los datos).
