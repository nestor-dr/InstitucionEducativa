const express = require('express')

const Anio = require('../schemas/anio')
const Curso = require('../schemas/curso')

const permitirRoles = require('../middlewares/authorization')

const router = express.Router()

router.get('/', obtenerTodosAnios)
router.get('/:id', obtenerAnioPorId)
router.post('/', permitirRoles('admin'), crearAnio)
router.put('/:id', permitirRoles('admin'), actualizarAnio)
router.delete('/:id', permitirRoles('admin'), borrarAnio)

// Busca otro año con el mismo nombre, sin importar mayusculas ni acentos
async function buscarAnioRepetido(nombre, idActual) {
  return await Anio.findOne({ nombre: (nombre || '').trim(), _id: { $ne: idActual } })
    .collation({ locale: 'es', strength: 1 })
}

//Obtiene todos los años existentes
async function obtenerTodosAnios(req, res, next) {
    try {
      const anios = await Anio.find().sort({ nombre: 1 })
      res.send(anios)
    } catch (err) {
      next(err)
    }
  }

// Obtiene un año por su Id
async function obtenerAnioPorId(req, res, next) {
    try {
      const anio = await Anio.findById(req.params.id)

      if (!anio) {
        return res.status(404).send('Año no encontrado')
      }

      res.send(anio)
    } catch (err) {
      next(err)
    }
  }

// Creamos un año
async function crearAnio(req, res, next) {
    try {
      if (await buscarAnioRepetido(req.body.nombre)) {
        return res.status(400).send('Ya existe un año con ese nombre')
      }

      const anioCreado = await Anio.create({ nombre: req.body.nombre })
      res.status(201).send(anioCreado)
    } catch (err) {
      next(err)
    }
  }

// Actualizamos el nombre de un año
async function actualizarAnio(req, res, next) {
    try {
      const anio = await Anio.findById(req.params.id)
      if (!anio) {
        return res.status(404).send('Año no encontrado')
      }

      if (await buscarAnioRepetido(req.body.nombre, anio._id)) {
        return res.status(400).send('Ya existe un año con ese nombre')
      }

      anio.nombre = req.body.nombre
      await anio.save()
      res.send(anio)
    } catch (err) {
      next(err)
    }
  }

// Borramos un año (solo si ningun curso lo usa)
async function borrarAnio(req, res, next) {
    try {
      const anio = await Anio.findById(req.params.id)
      if (!anio) {
        return res.status(404).send('Año no encontrado')
      }

      const cantidadCursos = await Curso.countDocuments({ anio: anio._id })
      if (cantidadCursos > 0) {
        return res.status(400).send(`No se puede borrar: el año está asignado a ${cantidadCursos} curso(s).`)
      }

      await Anio.deleteOne({ _id: anio._id })
      res.send(`Año Borrado :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }

module.exports = router
