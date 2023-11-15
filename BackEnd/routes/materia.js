const express = require('express')

const Materia = require('../schemas/materia')

const router = express.Router()

router.get('/', obtenerTodosMaterias)
router.get('/:id', obtenerMateriaPorId)

//Obtiene todas las materias existentes
async function obtenerTodosMaterias(req, res, next) {
    console.log('Obtener todas las materias por Id ', req.materia._id)
    try {
      const materias = await Materia.find()
      res.send(materias)
    } catch (err) {
      next(err)
    }
  }

// Obtiene una materia por su Id
async function obtenerMateriaPorId(req, res, next) {
    console.log('Obtener la materia por Id: ', req.params.id)
  
    if (!req.params.id) {
      res.status(500).send('El parametro Id no esta definido')
    }
  
    try {
      const materia = await Materia.findById(req.params.id)
  
      if (!materia || materia.length == 0) {
        res.status(404).send('materia no encontrado')
      }
  
      res.send(materia)
    } catch (err) {
      next(err)
    }
  }

module.exports = router