const express = require('express')

const Boletin = require('../schemas/boletin')
const Materia = require('../schemas/materia')
const Alumno = require('../schemas/alumno')

const router = express.Router()

router.get('/', obtenerTodosBoletines)
router.get('/:id', obtenerBoletinPorId)
router.post('/', crearBoletin)
router.put('/:id', actualizarBoletin)
router.delete('/:id', borrarBoletin)

//Obtiene todos los boletines existentes
async function obtenerTodosBoletines(req, res, next) {
    console.log('obtener Todos boletines por Id ', req.boletin._id)
    try {
      const boletines = await Boletin.find().populate('materia').populate('alumno')
      res.send(boletines)
    } catch (err) {
      next(err)
    }
  }
  
  // Obtiene un boletin por su Id
  async function obtenerBoletinPorId(req, res, next) {
    console.log('Obtener boletin por Id: ', req.params.id)
  
    if (!req.params.id) {
      res.status(500).send('El parametro Id no esta definido')
    }
  
    try {
        const boletin = await Boletin.find().populate('materia').populate('alumno')
  
      if (!boletin || boletin.length == 0) {
        res.status(404).send('Boletin no encontrado')
      }
  
      res.send(boletin)
    } catch (err) {
      next(err)
    }
  }
  
  // Creamos un boletin a partir de los datos obtenidos
  async function crearBoletin(req, res, next) {
    console.log('crear boletin: ', req.body)
  
    const boletin = req.body
  
    try {
      const materia = await Materia.findOne({ name: boletin.materia })
      const alumno = await Alumno.findOne({ name: boletin.alumno })
      
      if (!materia) {
        res.status(404).send('Materia no encontrado')
      }

      if (!alumno) {
        res.status(404).send('Alumno no encontrado')
      }
  
      const boletinCreado = await Boletin.create({ ...boletin, materia: materia._id, alumno: alumno._id })
  
      res.send(boletinCreado)
    } catch (err) {
      next(err)
    }
  }
  
  // Actualizamos un boletin
  async function actualizarBoletin(req, res, next) {
    console.log('actualizar boletin con Id: ', req.params.id)
  
    if (!req.params.id) {
      return res.status(404).send('Parametro Id no encontrado')
    }
  
    try {
      const boletinParaActualizar = await Boletin.findById(req.params.id)
  
      if (!boletinParaActualizar) {
        req.logger.error('Boletin no encontrado')
        return res.status(404).send('Boletin no encontrado')
      }
  
      if (req.body.materia) {
        const nuevaMateria = await Materia.findById(req.body.materia)
      if (req.body.alumno) {
        const nuevoAlumno = await Alumno.findById(req.body.alumno)
  
        if (!nuevaMateria) {
          req.logger.verbose('Nueva materia no encontrada. Enviando 400 al cliente')
          return res.status(400).end()
        }
        req.body.materia = nuevaMateria._id
        if (!nuevoAlumno) {
            req.logger.verbose('Nuevo alumno no encontrado. Enviando 400 al cliente')
            return res.status(400).end()
          }
          req.body.alumno = nuevoAlumno._id
      }
  
      // Esto va retornar el estado previo
      await boletinParaActualizar.updateOne(req.body)
      res.send(boletinParaActualizar)
        }
    } catch (err) {
      next(err)
    }
  }
  
  //Borramos un boletin
  async function borrarBoletin(req, res, next) {
    console.log('borrar boletin con Id: ', req.params.id)
  
    if (!req.params.id) {
      res.status(500).send('El parametro Id no esta definido')
    }
  
    try {
      const boletin = await Boletin.findById(req.params.id)
  
      if (!boletin) {
        res.status(404).send('Alumno no encontrado')
      }
  
      await Boletin.deleteOne({ _id: boletin._id })
  
      res.send(`Boletin Borrado :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }

module.exports = router