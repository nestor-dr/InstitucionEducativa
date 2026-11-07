// Manejo de la sesion (token + datos del usuario logueado)
// Si se tildo "Recordarme" se guarda en localStorage (queda aunque se cierre el navegador);
// si no, en sessionStorage (se borra al cerrar el navegador)

const CLAVE = 'usuario'

// Devuelve la sesion guardada ({ token, usuario }) o null si no hay
export function obtenerSesion() {
  const guardada = localStorage.getItem(CLAVE) || sessionStorage.getItem(CLAVE)
  return guardada ? JSON.parse(guardada) : null
}

// Datos del usuario logueado ({ _id, nombre, apellido, email, rol }) o {} si no hay sesion
export function usuarioLogueado() {
  const sesion = obtenerSesion()
  return sesion && sesion.usuario ? sesion.usuario : {}
}

// Guarda la sesion al loguearse, en un lado o en el otro segun "Recordarme"
export function guardarSesion(sesion, recordar) {
  cerrarSesion()
  const almacen = recordar ? localStorage : sessionStorage
  almacen.setItem(CLAVE, JSON.stringify(sesion))
}

// Actualiza los datos guardados (ej: cambio de nombre) en el mismo lugar donde estaban
export function actualizarSesion(sesion) {
  const almacen = localStorage.getItem(CLAVE) ? localStorage : sessionStorage
  almacen.setItem(CLAVE, JSON.stringify(sesion))
}

// Borra la sesion de los dos lados
export function cerrarSesion() {
  localStorage.removeItem(CLAVE)
  sessionStorage.removeItem(CLAVE)
}
