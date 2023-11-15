const express = require('express')

const Curso = require('../schemas/curso')
const Materia = require('../schemas/materia')

const router = express.Router()

router.get('/', obtenerTodosCursos)
router.get('/:id', obtenerCursoPorId)
router.post('/', crearCurso)
router.put('/:id', actualizarCurso)
router.delete('/:id', borrarCurso)

//Obtiene todos los cursos existentes
async function obtenerTodosCursos(req, res, next) {
    try {
      const cursos = await Curso.find().populate('materia')
      res.send(cursos)
    } catch (err) {
      next(err)
    }
  }

// Obtiene un curso por su Id
async function obtenerCursoPorId(req, res, next) {
    console.log('Obtener el curso por Id: ', req.params.id)
  
    if (!req.params.id) {
      res.status(500).send('El parametro Id no esta definido')
    }
  
    try {
      const curso = await Curso.findById(req.params.id).populate('materia')
  
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
    console.log('Crear curso: ', req.body)
  
    const curso = req.body
  
    try {
      const materia = await Materia.findOne({ name: curso.materia })
      if (!materia) {
        res.status(404).send('Materia no encontrado')
      }
  
      const cursoCreado = await Curso.create({ ...curso, materia: materia._id })
  
      res.send(cursoCreado)
    } catch (err) {
      next(err)
    }
  }

// Actualizamos un curso
async function actualizarCurso(req, res, next) {
    console.log('Actualizar usuario con Id: ', req.params.id)
  
    if (!req.params.id) {
      return res.status(404).send('Parametro Id no encontrado')
    }

    try {
      const cursoParaActualizar = await Curso.findById(req.params.id)
  
      if (!cursoParaActualizar) {
        req.logger.error('Curso no encontrado')
        return res.status(404).send('Curso no encontrado')
      }
  
      if (req.body.materia) {
        const nuevaMateria = await Materia.findById(req.body.materia)
  
        if (!nuevaMateria) {
          req.logger.verbose('Nueva materia no encontrada. Enviando 400 al cliente')
          return res.status(400).end()
        }
        req.body.materia = nuevaMateria._id
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
    console.log('Borrar usuario con Id: ', req.params.id)
  
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