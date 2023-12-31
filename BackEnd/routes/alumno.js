const express = require('express')

const Alumno = require('../schemas/alumno')
const Curso = require('../schemas/curso')
const { ObjectId } = require('mongodb')

const router = express.Router()

router.get('/', obtenerTodosAlumnos)
router.get('/:id', obtenerAlumnoPorId)
router.post('/', crearAlumno)
router.put('/', actualizarAlumno)
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

  const alumno = req.body

  try {

    const alumnoExistente = await Alumno.findOne({ nroLegajo: alumno.nroLegajo});

    const curso = (alumno.curso == null) ? '' : await Curso.findOne({ _id: alumno.curso });

    if (alumnoExistente) {
      return res.status(400).send('El número de legajo ya existe');
    }

    const alumnoCreado = await Alumno.create({ ...alumno, curso: curso._id })

    res.send(alumnoCreado)
  } catch (err) {
    next(err)
  }
}

// Actualizamos un alumno
async function actualizarAlumno(req, res, next) {
  try {
    const alumnoParaActualizar = await Alumno.findOne({nroLegajo: req.body.nroLegajo})
    console.log("body", req.body)
    if (!alumnoParaActualizar) {
      req.logger.error('Alumno no encontrado')
      return res.status(404).send('Alumno no encontrado')
    }

    (req.body.curso !== '') ? await Curso.findById(req.body.curso) : req.body.curso = null;    

  await alumnoParaActualizar.updateOne(req.body)
  res.send(alumnoParaActualizar)

  } catch (err) {
    next(err)
  }
}

//Borramos un alumno
async function borrarAlumno(req, res, next) {

  if (!req.params.id) {
    res.status(500).send('El parametro Id no esta definido');
  }

  try {
    const alumno = await Alumno.findById(req.params.id);
    
    if (!alumno) {
      res.status(404).send('Alumno no encontrado');
    }

    await Alumno.deleteOne({ _id: alumno._id });

    res.send(`Alumno Borrado :  ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

module.exports = router