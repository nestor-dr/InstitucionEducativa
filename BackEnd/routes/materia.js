const express = require('express')

const Materia = require('../schemas/materia')
const Curso = require('../schemas/curso')
const Boletin = require('../schemas/boletin')

const permitirRoles = require('../middlewares/authorization')

const router = express.Router()

router.get('/', obtenerTodosMaterias)
router.get('/:id', obtenerMateriaPorId)
router.post('/', permitirRoles('admin'), crearMateria)
router.put('/:id', permitirRoles('admin'), actualizarMateria)
router.delete('/:id', permitirRoles('admin'), borrarMateria)

// Busca otra materia con el mismo nombre, sin importar mayusculas ni acentos
async function buscarMateriaRepetida(nombre, idActual) {
  return await Materia.findOne({ nombre: (nombre || '').trim(), _id: { $ne: idActual } })
    .collation({ locale: 'es', strength: 1 })
}

//Obtiene todas las materias existentes
async function obtenerTodosMaterias(req, res, next) {

    try {
      const materias = await Materia.find().sort({ nombre: 1 })
      res.send(materias)
    } catch (err) {
      next(err)
    }
  }

// Obtiene una materia por su Id
async function obtenerMateriaPorId(req, res, next) {
    try {
      const materia = await Materia.findById(req.params.id)

      if (!materia) {
        return res.status(404).send('Materia no encontrada')
      }

      res.send(materia)
    } catch (err) {
      next(err)
    }
  }

// Creamos una materia
async function crearMateria(req, res, next) {
    try {
      if (await buscarMateriaRepetida(req.body.nombre)) {
        return res.status(400).send('Ya existe una materia con ese nombre')
      }

      const materiaCreada = await Materia.create({ nombre: req.body.nombre })
      res.status(201).send(materiaCreada)
    } catch (err) {
      next(err)
    }
  }

// Actualizamos el nombre de una materia
async function actualizarMateria(req, res, next) {
    try {
      const materia = await Materia.findById(req.params.id)
      if (!materia) {
        return res.status(404).send('Materia no encontrada')
      }

      if (await buscarMateriaRepetida(req.body.nombre, materia._id)) {
        return res.status(400).send('Ya existe una materia con ese nombre')
      }

      materia.nombre = req.body.nombre
      await materia.save()
      res.send(materia)
    } catch (err) {
      next(err)
    }
  }

// Borramos una materia (solo si no esta en uso)
async function borrarMateria(req, res, next) {
    try {
      const materia = await Materia.findById(req.params.id)
      if (!materia) {
        return res.status(404).send('Materia no encontrada')
      }

      const cantidadCursos = await Curso.countDocuments({ materias: materia._id })
      if (cantidadCursos > 0) {
        return res.status(400).send(`No se puede borrar: la materia está asignada a ${cantidadCursos} curso(s). Sacala de los cursos primero.`)
      }

      const cantidadBoletines = await Boletin.countDocuments({ 'notas.materia': materia._id })
      if (cantidadBoletines > 0) {
        return res.status(400).send(`No se puede borrar: la materia tiene notas en ${cantidadBoletines} boletín(es).`)
      }

      await Materia.deleteOne({ _id: materia._id })
      res.send(`Materia Borrada :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }

module.exports = router
