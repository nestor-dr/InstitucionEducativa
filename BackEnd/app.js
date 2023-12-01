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
// const boletinRouter = require('./routes/boletin')
//const authentication = require('./middlewares/authentication')
const authorization = require('./middlewares/authorization')

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(authorization)

// This is to aviod error
app.get('/favicon.ico', (req, res) => res.status(204))

app.use('/', statusRouter)
app.use('/auth', authRouter)
app.use('/usuarios', usuarioRouter)
app.use('/alumnos', alumnoRouter)
app.use('/cursos', cursoRouter)
// app.use('/boletines', authentication, boletinRouter)
app.use('/anios', anioRouter)
app.use('/materias', materiaRouter)

module.exports = app
