const express = require('express')

const Anio = require('../schemas/anio')

const router = express.Router()

router.get('/', obtenerTodosAnios)
router.get('/:id', obtenerAnioPorId)

//Obtiene todos los años existentes
async function obtenerTodosAnios(req, res, next) {
    try {
      
      const anios = await Anio.find()
      res.send(anios)

    } catch (err) {
      next(err)
    }
  }

// Obtiene un año por su Id
async function obtenerAnioPorId(req, res, next) {
  
    if (!req.params.id) {
      res.status(500).send('El parametro Id no esta definido')
    }
  
    try {

      const anio = await Anio.findById(req.params.id)
  
      if (!anio || anio.length == 0) {
        res.status(404).send('Año no encontrado')
      }
  
      res.send(anio)

    } catch (err) {
      next(err)
    }
  }

module.exports = router