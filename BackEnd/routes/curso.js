const express = require('express')

const Curso = require('../schemas/curso')
const Materia = require('../schemas/materia')
const Anio = require('../schemas/anio')

const router = express.Router()

router.get('/', obtenerTodosCursos)
router.get('/:id', obtenerCursoPorId)
router.post('/', crearCurso)
router.put('/', actualizarCurso)
router.delete('/:id', borrarCurso)

//Obtiene todos los cursos existentes
async function obtenerTodosCursos(req, res, next) {
    try {
      const cursos = await Curso.find().populate('materias').populate('anio')
      console.log(cursos)
      res.send(cursos)
    } catch (err) {
      next(err)
    }
  }

// Obtiene un curso por su Id
async function obtenerCursoPorId(req, res, next) {
  
    if (!req.params.id) {
      res.status(500).send('El parametro Id no esta definido')
    }
  
    try {
      const curso = await Curso.findById(req.params.id).populate('materias').populate('anio')
  
      if (!curso || curso.length == 0) {
        res.status(404).send('curso no encontrado')
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
      const cursoParaActualizar = await Curso.findOne({nombre: req.body.nombre})
      if (!cursoParaActualizar) {
        req.logger.error('Curso no encontrado')
        return res.status(404).send('Curso no encontrado')
      }

      if (req.body.anio) {
        const nuevoAnio = await Anio.findById(req.body.anio)

        if (!nuevoAnio) {
          req.logger.error('Nuevo Año no encontrado. Enviando 400 al cliente')
          return res.status(400).end()
        }

        req.body.anio = nuevoAnio._id
      }

      if (req.body.materias) {
        // Obtener las materias existentes del curso
        const materias = await Materia.find({ _id: { $in: req.body.materias } });
        req.body.materias = [...materias.map((materia) => materia._id)];
      }

      // Esto va retornar el estado previo
      await cursoParaActualizar.updateOne(req.body)
      res.send(cursoParaActualizar)

    } catch (err) {
      next(err)
    }
  }

//Borramos un curso
async function borrarCurso(req, res, next) {
    
    if (!req.params.id) {
      res.status(500).send('El parametro Id no esta definido')
    }
  
    try {
      const curso = await Curso.findById(req.params.id)
  
      if (!curso) {
        res.status(404).send('Curso no encontrado')
      }
  
      await Curso.deleteOne({ _id: curso._id })
  
      res.send(`Curso Borrado :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }

module.exports = router