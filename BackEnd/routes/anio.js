const express = require('express')

const Anio = require('../schemas/anio')

const router = express.Router()

router.get('/', obtenerTodosAnios)
router.get('/:id', obtenerAnioPorId)

//Obtiene todos los anios existentes
async function obtenerTodosAnios(req, res, next) {
    console.log('Obtener todos los anios por Id ', req.anio._id)
    try {
      const anios = await Anio.find().populate('materia')
      res.send(anios)
    } catch (err) {
      next(err)
    }
  }

// Obtiene un anio por su Id
async function obtenerAnioPorId(req, res, next) {
    console.log('Obtener el anio por Id: ', req.params.id)
  
    if (!req.params.id) {
      res.status(500).send('El parametro Id no esta definido')
    }
  
    try {
      const anio = await Anio.findById(req.params.id)
  
      if (!anio || anio.length == 0) {
        res.status(404).send('anio no encontrado')
      }
  
      res.send(anio)
    } catch (err) {
      next(err)
    }
  }

module.exports = router