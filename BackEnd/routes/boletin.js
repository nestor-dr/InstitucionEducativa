const express = require('express')

const Boletin = require('../schemas/boletin')
const Materia = require('../schemas/materia')
const Alumno = require('../schemas/alumno')
const Curso = require('../schemas/curso')

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
    console.log('crear boletin: ', req.body);
  
    const { alumnoId, cursoNombre, notas } = req.body;
  
    try {
      // Buscar el alumno por el ID
      const alumno = await Alumno.findById(alumnoId);
  
      // Verificar si el alumno existe
      if (!alumno) {
        return res.status(404).send('Alumno no encontrado');
      }
  
      // Buscar el curso por el nombre
      const curso = await Curso.findOne({ nombre: cursoNombre });
  
      // Verificar si el curso existe
      if (!curso) {
        return res.status(404).send('Curso no encontrado');
      }
  
      // Crear el boletín con las referencias al alumno, al curso y las notas
      const boletinCreado = await Boletin.create({
        alumno: alumno._id,
        curso: curso._id,
        notas,
      });
  
      res.send(boletinCreado);
    } catch (err) {
      next(err);
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