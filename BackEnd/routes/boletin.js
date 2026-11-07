const express = require('express')

const Boletin = require('../schemas/boletin')
const Alumno = require('../schemas/alumno')
const Curso = require('../schemas/curso')

const permitirRoles = require('../middlewares/authorization')

const router = express.Router()

// El alumno solo puede ver sus propios boletines
router.get('/mio', permitirRoles('alumno'), obtenerMisBoletines)

// Todo lo demas es del profesor
router.get('/', permitirRoles('profesor'), obtenerTodosBoletines)
router.get('/alumno/:id', permitirRoles('profesor'), obtenerBoletinesDeAlumno)
router.get('/:id', permitirRoles('profesor'), obtenerBoletinPorId)
router.post('/', permitirRoles('profesor'), crearBoletin)
router.put('/:id', permitirRoles('profesor'), actualizarBoletin)
router.delete('/:id', permitirRoles('profesor'), borrarBoletin)

// Trae el boletin con el alumno, el curso (con año y materias) y el nombre de cada materia
function completarBoletin(consulta) {
  return consulta
    .populate('alumno')
    .populate({ path: 'curso', populate: [{ path: 'anio' }, { path: 'materias' }] })
    .populate('notas.materia')
}

// Valida que las notas sean de las materias del curso, sin repetir, y entre 1 y 10
// Devuelve el mensaje de error o null si esta todo bien
function validarNotas(notas, curso) {
  if (!Array.isArray(notas) || notas.length === 0) {
    return 'Se deben enviar las notas del boletín'
  }

  if (!curso.materias || curso.materias.length === 0) {
    return 'El curso no tiene materias asignadas'
  }

  const materiasDelCurso = curso.materias.map((materia) => materia._id.toString())
  const cargadas = []

  for (const item of notas) {
    const materiaId = item.materia ? item.materia.toString() : ''
    const materia = curso.materias.find((m) => m._id.toString() === materiaId)

    if (!materia) {
      return 'Hay notas de materias que no pertenecen al curso'
    }

    if (cargadas.includes(materiaId)) {
      return `La materia ${materia.nombre} está repetida`
    }

    const nota = Number(item.nota)
    if (item.nota === '' || item.nota === null || isNaN(nota) || nota < 1 || nota > 10) {
      return `La nota de ${materia.nombre} tiene que ser un número entre 1 y 10`
    }

    cargadas.push(materiaId)
  }

  // El boletin tiene que tener la nota de todas las materias del curso
  if (cargadas.length !== materiasDelCurso.length) {
    return 'Falta cargar la nota de alguna materia del curso'
  }

  return null
}

//Obtiene todos los boletines existentes
async function obtenerTodosBoletines(req, res, next) {
  try {
    const boletines = await completarBoletin(Boletin.find().sort({ createdAt: -1 }))
    res.send(boletines)
  } catch (err) {
    next(err)
  }
}

// Obtiene los boletines del alumno logueado
// El alumno sale del token (no de la URL), asi nadie puede pedir el boletin de otro
async function obtenerMisBoletines(req, res, next) {
  if (!req.user.alumno) {
    return res.status(400).send('Tu usuario no está vinculado a ningún alumno')
  }

  try {
    const boletines = await completarBoletin(Boletin.find({ alumno: req.user.alumno }).sort({ createdAt: -1 }))
    res.send(boletines)
  } catch (err) {
    next(err)
  }
}

// Obtiene los boletines de un alumno (para saber si ya tiene uno antes de crear otro)
async function obtenerBoletinesDeAlumno(req, res, next) {
  try {
    const boletines = await Boletin.find({ alumno: req.params.id }).populate('curso')
    res.send(boletines)
  } catch (err) {
    next(err)
  }
}

// Obtiene un boletin por su Id
async function obtenerBoletinPorId(req, res, next) {
  try {
    const boletin = await completarBoletin(Boletin.findById(req.params.id))

    if (!boletin) {
      return res.status(404).send('Boletín no encontrado')
    }

    res.send(boletin)
  } catch (err) {
    next(err)
  }
}

// Creamos un boletin para un alumno con las notas de las materias de su curso
// Body: { alumno: id, curso: id, notas: [{ materia: id, nota: 8 }] }
async function crearBoletin(req, res, next) {
  const { alumno: alumnoId, curso: cursoId, notas } = req.body

  try {
    const alumno = await Alumno.findById(alumnoId)
    if (!alumno) {
      return res.status(404).send('Alumno no encontrado')
    }

    const curso = await Curso.findById(cursoId).populate('materias')
    if (!curso) {
      return res.status(404).send('Curso no encontrado')
    }

    // El curso tiene que ser el del alumno
    if (!alumno.curso || alumno.curso.toString() !== curso._id.toString()) {
      return res.status(400).send('El alumno no pertenece a ese curso')
    }

    const errorNotas = validarNotas(notas, curso)
    if (errorNotas) {
      return res.status(400).send(errorNotas)
    }

    const boletinExistente = await Boletin.findOne({ alumno: alumno._id, curso: curso._id })
    if (boletinExistente) {
      return res.status(400).send('Ya existe un boletín para este alumno en este curso')
    }

    const boletinCreado = await Boletin.create({ alumno: alumno._id, curso: curso._id, notas })

    req.logger.info(`Boletín ${boletinCreado._id} creado por el usuario ${req.user._id}`)
    res.status(201).send(await completarBoletin(Boletin.findById(boletinCreado._id)))
  } catch (err) {
    next(err)
  }
}

// Actualizamos las notas de un boletin
// Body: { notas: [{ materia: id, nota: 8 }] }
async function actualizarBoletin(req, res, next) {
  try {
    const boletin = await Boletin.findById(req.params.id)

    if (!boletin) {
      return res.status(404).send('Boletín no encontrado')
    }

    const curso = await Curso.findById(boletin.curso).populate('materias')
    if (!curso) {
      return res.status(404).send('El curso del boletín ya no existe')
    }

    const errorNotas = validarNotas(req.body.notas, curso)
    if (errorNotas) {
      return res.status(400).send(errorNotas)
    }

    boletin.notas = req.body.notas
    await boletin.save()

    res.send(await completarBoletin(Boletin.findById(boletin._id)))
  } catch (err) {
    next(err)
  }
}

//Borramos un boletin
async function borrarBoletin(req, res, next) {
  try {
    const boletin = await Boletin.findById(req.params.id)

    if (!boletin) {
      return res.status(404).send('Boletín no encontrado')
    }

    await Boletin.deleteOne({ _id: boletin._id })

    req.logger.info(`Boletín ${boletin._id} borrado por el usuario ${req.user._id}`)
    res.send(`Boletin Borrado :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

module.exports = router
