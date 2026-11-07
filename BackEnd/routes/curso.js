const express = require('express')

const Curso = require('../schemas/curso')
const Materia = require('../schemas/materia')
const Anio = require('../schemas/anio')
const Alumno = require('../schemas/alumno')
const Boletin = require('../schemas/boletin')

const permitirRoles = require('../middlewares/authorization')
const { leerPaginacion, regexBusqueda, responderListado } = require('../utils/paginacion')

const router = express.Router()

router.get('/', obtenerTodosCursos)
router.get('/:id', obtenerCursoPorId)
router.post('/', permitirRoles('admin'), crearCurso)
router.put('/:id', permitirRoles('admin'), actualizarCurso)
router.delete('/:id', permitirRoles('admin'), borrarCurso)

//Obtiene todos los cursos existentes
// Con ?pagina=1&limite=10&buscar=texto devuelve una pagina, buscando por el nombre del curso
async function obtenerTodosCursos(req, res, next) {
    try {
      const paginacion = leerPaginacion(req.query)
      const filtro = paginacion.buscar ? { nombre: regexBusqueda(paginacion.buscar) } : {}

      const consulta = Curso.find(filtro).populate('materias').populate('anio').sort({ nombre: 1, _id: 1 })
      await responderListado(res, Curso, filtro, consulta, paginacion)
    } catch (err) {
      next(err)
    }
  }

// Obtiene un curso por su Id
async function obtenerCursoPorId(req, res, next) {
  
    if (!req.params.id) {
      return res.status(400).send('El parametro Id no esta definido')
    }
  
    try {
      const curso = await Curso.findById(req.params.id).populate('materias').populate('anio')
  
      if (!curso || curso.length == 0) {
        return res.status(404).send('curso no encontrado')
      }
  
      res.send(curso)
    } catch (err) {
      next(err)
    }
  }

// Valida los datos de un curso (al crear y al modificar)
// Devuelve el mensaje de error o null si esta todo bien. Deja req.body listo para guardar.
async function validarCurso(req, idActual) {
  const nombre = (req.body.nombre || '').trim()
  if (!nombre) {
    return 'Ingresá el nombre del curso'
  }

  // Nombre repetido (sin importar mayusculas)
  const repetido = await Curso.findOne({ nombre, _id: { $ne: idActual } }).collation({ locale: 'es', strength: 1 })
  if (repetido) {
    return 'Ya existe un curso con ese nombre'
  }

  // El año es opcional: si viene tiene que existir, si viene vacio el curso queda sin año
  if (req.body.anio) {
    const anio = await Anio.findById(req.body.anio)
    if (!anio) {
      return 'El año indicado no existe'
    }
  } else {
    req.body.anio = null
  }

  // Tiene que tener al menos una materia y todas tienen que existir
  if (!Array.isArray(req.body.materias) || req.body.materias.length === 0) {
    return 'El curso tiene que tener al menos una materia'
  }
  const materias = await Materia.find({ _id: { $in: req.body.materias } })
  if (materias.length !== req.body.materias.length) {
    return 'Alguna de las materias indicadas no existe'
  }

  req.body.nombre = nombre
  req.body.materias = materias.map((materia) => materia._id)
  return null
}

// Creamos un curso a partir de los datos obtenidos
async function crearCurso(req, res, next) {
    try {
      const errorCurso = await validarCurso(req)
      if (errorCurso) {
        return res.status(400).send(errorCurso)
      }

      const cursoCreado = await Curso.create({ nombre: req.body.nombre, anio: req.body.anio, materias: req.body.materias })
      res.status(201).send(cursoCreado)
    } catch (err) {
      next(err)
    }
  }

// Actualizamos un curso
async function actualizarCurso(req, res, next) {

    try {
      const cursoParaActualizar = await Curso.findById(req.params.id)
      if (!cursoParaActualizar) {
        return res.status(404).send('Curso no encontrado')
      }

      const errorCurso = await validarCurso(req, cursoParaActualizar._id)
      if (errorCurso) {
        return res.status(400).send(errorCurso)
      }

      // Devuelve el curso ya actualizado
      const cursoActualizado = await Curso.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('materias').populate('anio')
      res.send(cursoActualizado)
    } catch (err) {
      next(err)
    }
  }

//Borramos un curso
async function borrarCurso(req, res, next) {
    
    if (!req.params.id) {
      return res.status(400).send('El parametro Id no esta definido')
    }
  
    try {
      const curso = await Curso.findById(req.params.id)
  
      if (!curso) {
        return res.status(404).send('Curso no encontrado')
      }

      // No se borra un curso con alumnos o boletines, para no dejar referencias rotas
      const cantidadAlumnos = await Alumno.countDocuments({ curso: curso._id })
      if (cantidadAlumnos > 0) {
        return res.status(400).send(`No se puede borrar: el curso tiene ${cantidadAlumnos} alumno(s) asignado(s). Cambialos de curso primero.`)
      }

      const cantidadBoletines = await Boletin.countDocuments({ curso: curso._id })
      if (cantidadBoletines > 0) {
        return res.status(400).send(`No se puede borrar: el curso tiene ${cantidadBoletines} boletín(es).`)
      }

      await Curso.deleteOne({ _id: curso._id })
  
      res.send(`Curso Borrado :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }

module.exports = router