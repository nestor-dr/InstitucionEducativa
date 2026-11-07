// Ayudas para los listados con busqueda y paginacion en el servidor
// Ej: GET /alumnos?pagina=2&limite=10&buscar=gomez -> { datos, total, pagina, limite }
// Si no viene ?pagina se devuelve la lista completa (la usan los Select para elegir un alumno, curso, etc.)

const LIMITE_MAXIMO = 100

// Lee pagina, limite y buscar de la URL
function leerPaginacion(query) {
  const pagina = Math.max(parseInt(query.pagina, 10) || 1, 1)
  const limite = Math.min(Math.max(parseInt(query.limite, 10) || 10, 1), LIMITE_MAXIMO)
  const buscar = typeof query.buscar === 'string' ? query.buscar.trim() : ''
  return { paginar: query.pagina !== undefined, pagina, limite, buscar }
}

// Arma la expresion regular para buscar un texto sin distinguir mayusculas
// (se escapan los caracteres especiales para que "1.001" busque el punto literal)
function regexBusqueda(texto) {
  return new RegExp(texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
}

// Ejecuta la consulta: completa, o solo la pagina pedida junto con el total
// (el orden tiene que desempatar por _id, asi un registro no aparece en dos paginas)
async function responderListado(res, modelo, filtro, consulta, { paginar, pagina, limite }) {
  if (!paginar) {
    return res.send(await consulta)
  }

  const [datos, total] = await Promise.all([
    consulta.skip((pagina - 1) * limite).limit(limite),
    modelo.countDocuments(filtro),
  ])
  res.send({ datos, total, pagina, limite })
}

module.exports = { leerPaginacion, regexBusqueda, responderListado }
