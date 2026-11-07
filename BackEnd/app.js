const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

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

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// This is to aviod error
app.get('/favicon.ico', (req, res) => res.status(204))

// Rutas publicas
app.use('/', statusRouter)
app.use('/auth', authRouter)

// Rutas que necesitan estar logueado (el control por rol esta en cada router)
app.use('/usuarios', authentication, usuarioRouter)
app.use('/alumnos', authentication, alumnoRouter)
app.use('/cursos', authentication, cursoRouter)
app.use('/anios', authentication, anioRouter)
app.use('/materias', authentication, materiaRouter)

// Los boletines son solo del profesor
app.use('/boletines', authentication, permitirRoles('profesor'), boletinRouter)

module.exports = app
