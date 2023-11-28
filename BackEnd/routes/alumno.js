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
  console.log('crear Alumno: ', req.body)

  const alumno = req.body

  try {
    console.log(alumno.nroLegajo)  
    const alumnoExistente = await Alumno.findOne({ nroLegajo: alumno.nroLegajo});
    console.log('despues de la funcion')
    console.log(alumnoExistente)
    const curso = await Curso.findOne({ _id: alumno.curso })
    if (!curso) {
      res.status(404).send('Curso no encontrado')
    }
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

    if (!alumnoParaActualizar) {
      req.logger.error('Alumno no encontrado')
      return res.status(404).send('Alumno no encontrado')
    }
    console.log(alumnoParaActualizar.curso)
    console.log(req.body.curso)
    let nuevoCurso = null
    if (ObjectId.isValid(req.body.curso)) {
      nuevoCurso = await Curso.findById(req.body.curso)
    }else if(typeof req.body.curso === 'string'){
      nuevoCurso = await Curso.findOne({nombre: req.body.curso})
    }
      if (!nuevoCurso) {
        req.logger.error('Nuevo curso no encontrado. Enviando 400 al cliente')
        return res.status(400).end()
      }
      req.body.curso = nuevoCurso._id
    

    // Esto va retornar el estado previo
    await alumnoParaActualizar.updateOne(req.body)
    res.send(alumnoParaActualizar)

  } catch (err) {
    next(err)
  }
}

//Borramos un alumno
async function borrarAlumno(req, res, next) {
  console.log(req.params)
  if (!req.params.id) {
    res.status(500).send('El parametro Id no esta definido');
  }

  try {
    const alumno = await Alumno.findById(req.params.id);
    console.log(alumno)
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