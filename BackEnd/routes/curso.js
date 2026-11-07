const express = require('express')

const Curso = require('../schemas/curso')
const Materia = require('../schemas/materia')
const Anio = require('../schemas/anio')
const Alumno = require('../schemas/alumno')
const Boletin = require('../schemas/boletin')

const permitirRoles = require('../middlewares/authorization')

const router = express.Router()

router.get('/', obtenerTodosCursos)
router.get('/:id', obtenerCursoPorId)
router.post('/', permitirRoles('admin'), crearCurso)
router.put('/:id', permitirRoles('admin'), actualizarCurso)
router.delete('/:id', permitirRoles('admin'), borrarCurso)

//Obtiene todos los cursos existentes
async function obtenerTodosCursos(req, res, next) {
    try {
      const cursos = await Curso.find().populate('materias').populate('anio')
      res.send(cursos)
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

// Creamos un curso a partir de los datos obtenidos
async function crearCurso(req, res, next) {
  
    const curso = req.body

    try {
      const anio = (curso.anio == null) ? '' : await Anio.findOne({ _id: curso.anio });

      if (anio === null) {
        return res.status(400).send('El año indicado no existe')
      }

      const materias = (curso.materias == null) ? '' : await Materia.find({ _id: { $in: curso.materias } });
    
      const cursoCreado = await Curso.create({...curso, anio: anio._id, ...(materias !== '') && { materias: materias.map((materia) => materia._id) }});   
      res.send(cursoCreado)
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

      // Si viene un año tiene que existir; si viene vacio el curso queda sin año
      if (req.body.anio) {
        const anio = await Anio.findById(req.body.anio)
        if (!anio) {
          return res.status(400).send('El año indicado no existe')
        }
      } else {
        req.body.anio = null
      }

      if (req.body.materias) {
        // Todas las materias elegidas tienen que existir
        const materias = await Materia.find({ _id: { $in: req.body.materias } })
        if (materias.length !== req.body.materias.length) {
          return res.status(400).send('Alguna de las materias indicadas no existe')
        }
        req.body.materias = materias.map((materia) => materia._id)
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