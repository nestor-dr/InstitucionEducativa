const express = require('express')

const Alumno = require('../schemas/alumno')
const Curso = require('../schemas/curso')

const router = express.Router()

router.get('/', obtenerTodosAlumnos)
router.get('/:id', obtenerAlumnoPorId)
router.post('/', crearAlumno)
router.put('/:id', actualizarAlumno)
router.delete('/:id', borrarAlumno)

//Obtiene todos los alumnos existentes
async function obtenerTodosAlumnos(req, res, next) {
  try {
    const alumnos = await Alumno.find().populate('curso')
    res.send(alumnos)
  } catch (err) {
    next(err)
  }
}

// Obtiene un alumno por su Id
async function obtenerAlumnoPorId(req, res, next) {
  console.log('Obtener Alumno por Id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('El parametro Id no esta definido')
  }

  try {
    const alumno = await Alumno.findById(req.params.id).populate('curso')

    if (!alumno || alumno.length == 0) {
      res.status(404).send('Alumno no encontrado')
    }

    res.send(alumno)
  } catch (err) {
    next(err)
  }
}

// Creamos un alumno a partir de los datos obtenidos
async function crearAlumno(req, res, next) {
  console.log('crear Alumno: ', req.body)

  const alumno = req.body

  try {
    const curso = await Curso.findOne({ _id: alumno.curso })
    if (!curso) {
      res.status(404).send('Curso no encontrado')
    }

    const alumnoCreado = await Alumno.create({ ...alumno, curso: curso._id })

    res.send(alumnoCreado)
  } catch (err) {
    next(err)
  }
}

// Actualizamos un alumno
async function actualizarAlumno(req, res, next) {
  if (!req.params.id) {
    return res.status(404).send('Parametro Id no encontrado')
  }

  try {
    const alumnoParaActualizar = await Alumno.findById(req.params.id)

    if (!alumnoParaActualizar) {
      req.logger.error('Alumno no encontrado')
      return res.status(404).send('Alumno no encontrado')
    }

    if (req.body.curso) {
      const nuevoCurso = await Curso.findById(req.body.curso)

      if (!nuevoCurso) {
        req.logger.verbose('Nuevo curso no encontrado. Enviando 400 al cliente')
        return res.status(400).end()
      }
      req.body.curso = nuevoCurso._id
    }

    // Esto va retornar el estado previo
    await alumnoParaActualizar.updateOne(req.body)
    res.send(alumnoParaActualizar)

  } catch (err) {
    next(err)
  }
}

//Borramos un alumno
async function borrarAlumno(req, res, next) {

  if (!req.params.id) {
    res.status(500).send('El parametro Id no esta definido')
  }

  try {
    const alumno = await Alumno.findById(req.params.id)

    if (!alumno) {
      res.status(404).send('Alumno no encontrado')
    }

    await Alumno.deleteOne({ _id: alumno._id })

    res.send(`Alumno Borrado :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

module.exports = router