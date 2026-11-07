const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const createError = require('http-errors')

const logger = require('./utils/logger')
const statusRouter = require('./routes/status')
const authRouter = require('./routes/auth')
const usuarioRouter = require('./routes/usuario')
const alumnoRouter = require('./routes/alumno')
const cursoRouter = require('./routes/curso')
const anioRouter = require('./routes/anio')
const materiaRouter = require('./routes/materia')
const boletinRouter = require('./routes/boletin')
const authentication = require('./middlewares/authentication')
const permitirRoles = require('./middlewares/authorization')

const app = express()

// Cada pedido HTTP queda registrado en el log
app.use(morgan(':method :url :status - :response-time ms', {
  stream: { write: (linea) => logger.info(linea.trim()) },
}))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Deja el logger disponible en las rutas como req.logger
app.use((req, res, next) => {
  req.logger = logger
  next()
})

// This is to aviod error
app.get('/favicon.ico', (req, res) => res.status(204).end())

// Rutas publicas
app.use('/', statusRouter)
app.use('/auth', authRouter)

// Rutas que necesitan estar logueado (el control por rol de las escrituras esta en cada router)
app.use('/usuarios', authentication, usuarioRouter)
app.use('/alumnos', authentication, permitirRoles('admin', 'profesor'), alumnoRouter)
app.use('/cursos', authentication, permitirRoles('admin', 'profesor'), cursoRouter)
app.use('/anios', authentication, permitirRoles('admin', 'profesor'), anioRouter)
app.use('/materias', authentication, permitirRoles('admin', 'profesor'), materiaRouter)

// Boletines: el profesor los administra y el alumno solo ve el suyo (el detalle esta en el router)
app.use('/boletines', authentication, permitirRoles('profesor', 'alumno'), boletinRouter)

// Ruta inexistente
app.use((req, res, next) => {
  next(createError(404, `No existe la ruta ${req.method} ${req.originalUrl}`))
})

// Manejador de errores global: loguea y responde { mensaje } con el status correcto
/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, next) => {
  let status = err.status || 500
  let mensaje = err.message

  if (err.name === 'ValidationError') {
    // Faltan datos o tienen un formato invalido (lo valida Mongoose con el schema)
    status = 400
    mensaje = Object.values(err.errors)
      .map((e) => (e.kind === 'required' ? `El campo ${e.path} es obligatorio` : e.message))
      .join('. ')
  } else if (err.name === 'CastError') {
    // Un id u otro valor que no tiene el tipo esperado
    status = 400
    mensaje = `El valor '${err.value}' no es válido para el campo ${err.path}`
  } else if (err.type === 'entity.parse.failed') {
    // El body que llego no es un JSON valido
    mensaje = 'Los datos enviados no tienen un formato válido'
  } else if (err.code === 11000) {
    // Indice unico repetido
    status = 400
    mensaje = `Ya existe un registro con ese ${Object.keys(err.keyValue).join(', ')}`
  }

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.stack}`)
    mensaje = 'Ocurrió un error en el servidor, intentá de nuevo más tarde'
  } else {
    logger.warn(`${status} ${req.method} ${req.originalUrl} - ${mensaje}`)
  }

  res.status(status).json({ mensaje })
})

module.exports = app
