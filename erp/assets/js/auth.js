// Excellence Freights ERP — control de acceso
//
// VERSIÓN PROTOTIPO, SIN SERVIDOR: todo se valida en el navegador. Sirve para
// definir el flujo (inicio de sesión, cambio obligatorio de contraseña, permisos
// por área), pero NO es seguridad real: quien tenga los archivos puede saltarlo,
// y las contraseñas nuevas solo quedan guardadas en el navegador donde se cambiaron.
// Cuando haya servidor, solo hay que reemplazar las funciones de este archivo.
//
// Requiere usuarios.js (USUARIOS, ITERACIONES_PBKDF2), generado desde el Excel.

const AUTH = (() => {
  const CLAVE_SESION = "ef-sesion";
  const CLAVE_CREDENCIALES = "ef-credenciales"; // contraseñas cambiadas por cada usuario
  const CLAVE_INTENTOS = "ef-intentos";
  const MAX_INTENTOS = 5;
  const BLOQUEO_MIN = 5;
  const INACTIVIDAD_MIN = 30;

  // ---------- Almacenamiento ----------
  function leer(almacen, clave, porDefecto) {
    try {
      return JSON.parse(almacen.getItem(clave)) ?? porDefecto;
    } catch {
      return porDefecto;
    }
  }
  function guardar(almacen, clave, valor) {
    try {
      almacen.setItem(clave, JSON.stringify(valor));
      return true;
    } catch {
      return false;
    }
  }

  // ---------- Cifrado (PBKDF2-SHA256, igual que generar_usuarios.py) ----------
  const hexABytes = (hex) => new Uint8Array(hex.match(/../g).map((h) => parseInt(h, 16)));
  const bytesAHex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");

  async function calcularHuella(password, salHex) {
    const clave = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: hexABytes(salHex), iterations: ITERACIONES_PBKDF2 },
      clave,
      256,
    );
    return bytesAHex(bits);
  }

  function iguales(a, b) {
    if (a.length !== b.length) return false;
    let dif = 0;
    for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return dif === 0;
  }

  // ---------- Usuarios ----------
  function buscarUsuario(usuario) {
    return USUARIOS.find((u) => u.usuario === String(usuario).trim().toLowerCase());
  }

  function credencialVigente(u) {
    const cambiadas = leer(localStorage, CLAVE_CREDENCIALES, {});
    return cambiadas[u.usuario] || { sal: u.sal, hash: u.hash, temporal: true };
  }

  function estadoUsuario(u) {
    const c = credencialVigente(u);
    return { temporal: !!c.temporal, cambiada: c.cambiada || null, ultimoAcceso: c.ultimoAcceso || null };
  }

  // ---------- Bloqueo por intentos fallidos ----------
  function minutosBloqueo(usuario) {
    const r = leer(localStorage, CLAVE_INTENTOS, {})[usuario];
    if (!r || r.fallos < MAX_INTENTOS) return 0;
    const resta = r.hasta - Date.now();
    return resta > 0 ? Math.ceil(resta / 60000) : 0;
  }
  function registrarFallo(usuario) {
    const todos = leer(localStorage, CLAVE_INTENTOS, {});
    const r = todos[usuario] && todos[usuario].hasta > Date.now() ? todos[usuario] : { fallos: 0 };
    r.fallos += 1;
    r.hasta = Date.now() + BLOQUEO_MIN * 60000;
    todos[usuario] = r;
    guardar(localStorage, CLAVE_INTENTOS, todos);
  }
  function limpiarFallos(usuario) {
    const todos = leer(localStorage, CLAVE_INTENTOS, {});
    delete todos[usuario];
    guardar(localStorage, CLAVE_INTENTOS, todos);
  }

  // ---------- Sesión ----------
  async function iniciarSesion(usuario, password) {
    const u = buscarUsuario(usuario);
    const id = u ? u.usuario : String(usuario).trim().toLowerCase();
    const bloqueo = minutosBloqueo(id);
    if (bloqueo) return { ok: false, error: `Demasiados intentos. Espera ${bloqueo} min e intenta de nuevo.` };

    const c = u ? credencialVigente(u) : null;
    // Se calcula la huella aunque el usuario no exista, para no revelar cuáles existen.
    const huella = await calcularHuella(password, c ? c.sal : "00".repeat(16));
    if (!u || !iguales(huella, c.hash)) {
      registrarFallo(id);
      const minutos = minutosBloqueo(id);
      if (minutos) return { ok: false, error: `Demasiados intentos. Espera ${minutos} min e intenta de nuevo.` };
      return { ok: false, error: "Usuario o contraseña incorrectos." };
    }

    limpiarFallos(id);
    const sesion = {
      usuario: u.usuario,
      area: u.area,
      rol: u.rol,
      debeCambiar: !!c.temporal,
      ultimaActividad: Date.now(),
    };
    guardar(localStorage, CLAVE_SESION, sesion);
    if (!c.temporal) actualizarCredencial(u.usuario, { ultimoAcceso: new Date().toISOString() });
    return { ok: true, debeCambiar: sesion.debeCambiar };
  }

  function obtenerSesion() {
    const s = leer(localStorage, CLAVE_SESION, null);
    if (!s) return null;
    if (Date.now() - s.ultimaActividad > INACTIVIDAD_MIN * 60000) {
      cerrarSesion();
      return null;
    }
    s.ultimaActividad = Date.now();
    guardar(localStorage, CLAVE_SESION, s);
    return s;
  }

  function cerrarSesion() {
    try {
      localStorage.removeItem(CLAVE_SESION);
    } catch {
      /* nada que cerrar */
    }
  }

  // ---------- Contraseñas ----------
  function validarNueva(password) {
    const errores = [];
    if (password.length < 8) errores.push("al menos 8 caracteres");
    if (!/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(password)) errores.push("al menos una letra");
    if (!/\d/.test(password)) errores.push("al menos un número");
    return errores;
  }

  function actualizarCredencial(usuario, cambios) {
    const cambiadas = leer(localStorage, CLAVE_CREDENCIALES, {});
    if (!cambiadas[usuario]) return;
    cambiadas[usuario] = { ...cambiadas[usuario], ...cambios };
    guardar(localStorage, CLAVE_CREDENCIALES, cambiadas);
  }

  async function cambiarContrasena(actual, nueva) {
    const s = obtenerSesion();
    if (!s) return { ok: false, error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    const u = buscarUsuario(s.usuario);
    const c = credencialVigente(u);
    if (!iguales(await calcularHuella(actual, c.sal), c.hash)) {
      return { ok: false, error: "La contraseña actual no es correcta." };
    }
    const errores = validarNueva(nueva);
    if (errores.length) return { ok: false, error: `La nueva contraseña necesita ${errores.join(", ")}.` };
    if (nueva === actual) return { ok: false, error: "La nueva contraseña debe ser diferente a la actual." };

    const sal = bytesAHex(crypto.getRandomValues(new Uint8Array(16)));
    const cambiadas = leer(localStorage, CLAVE_CREDENCIALES, {});
    const ahora = new Date().toISOString();
    cambiadas[u.usuario] = { sal, hash: await calcularHuella(nueva, sal), cambiada: ahora, ultimoAcceso: ahora };
    if (!guardar(localStorage, CLAVE_CREDENCIALES, cambiadas)) {
      return { ok: false, error: "Este navegador no permite guardar datos; no se pudo cambiar la contraseña." };
    }
    s.debeCambiar = false;
    guardar(localStorage, CLAVE_SESION, s);
    return { ok: true };
  }

  // Administración (solo TI): vuelve a la contraseña temporal del Excel.
  function restablecer(usuario) {
    const s = obtenerSesion();
    if (!s || s.rol !== "admin") return false;
    const cambiadas = leer(localStorage, CLAVE_CREDENCIALES, {});
    delete cambiadas[usuario];
    guardar(localStorage, CLAVE_CREDENCIALES, cambiadas);
    limpiarFallos(usuario);
    return true;
  }

  // ---------- Permisos ----------
  // Admin (TI) ve todas las áreas; los demás solo la suya. La Mesa de ayuda es para todos.
  function puedeVerArea(sesion, areaId) {
    return sesion.rol === "admin" || sesion.area === areaId;
  }

  return {
    iniciarSesion,
    obtenerSesion,
    cerrarSesion,
    cambiarContrasena,
    validarNueva,
    restablecer,
    puedeVerArea,
    estadoUsuario,
    usuarios: () => USUARIOS.map(({ usuario, area, rol }) => ({ usuario, area, rol })),
  };
})();
