const express = require('express')

const Alumno = require('../schemas/alumno')
const Curso = require('../schemas/curso')
const Boletin = require('../schemas/boletin')
const Usuario = require('../schemas/usuario')

const permitirRoles = require('../middlewares/authorization')
const { leerPaginacion, regexBusqueda, responderListado } = require('../utils/paginacion')

const router = express.Router()

router.get('/', obtenerTodosAlumnos)
router.get('/:id', obtenerAlumnoPorId)
router.post('/', permitirRoles('admin'), crearAlumno)
router.put('/:id', permitirRoles('admin'), actualizarAlumno)
router.delete('/:id', permitirRoles('admin'), borrarAlumno)

//Obtiene todos los alumnos existentes
// Con ?pagina=1&limite=10&buscar=texto devuelve una pagina, buscando por nombre, apellido o legajo
// Con ?sinUsuario=true trae solo los que todavia no tienen usuario (para vincular un usuario alumno)
// y con &incluir=<id> suma ese alumno aunque ya tenga usuario (el vinculado al usuario que se edita)
async function obtenerTodosAlumnos(req, res, next) {
  try {
    const paginacion = leerPaginacion(req.query)
    const filtro = {}

    if (req.query.sinUsuario === 'true') {
      const vinculados = await Usuario.distinct('alumno', { alumno: { $ne: null } })
      filtro._id = { $nin: vinculados.filter((id) => String(id) !== req.query.incluir) }
    }

    if (paginacion.buscar) {
      const texto = regexBusqueda(paginacion.buscar)
      filtro.$or = [{ nombre: texto }, { apellido: texto }, { nroLegajo: texto }]
    }

    const consulta = Alumno.find(filtro).populate('curso').sort({ apellido: 1, nombre: 1, _id: 1 }).collation({ locale: 'es' })
    await responderListado(res, Alumno, filtro, consulta, paginacion)
  } catch (err) {
    next(err)
  }
}

// Obtiene un alumno por su Id
async function obtenerAlumnoPorId(req, res, next) {
  console.log('Obtener Alumno por Id: ', req.params.id)

  if (!req.params.id) {
    return res.status(400).send('El parametro Id no esta definido')
  }

  try {
    const alumno = await Alumno.findById(req.params.id).populate('curso')

    if (!alumno || alumno.length == 0) {
      return res.status(404).send('Alumno no encontrado')
    }

    res.send(alumno)
  } catch (err) {
    next(err)
  }
}

// Creamos un alumno a partir de los datos obtenidos
async function crearAlumno(req, res, next) {

  const alumno = req.body

  try {

    const alumnoExistente = await Alumno.findOne({ nroLegajo: alumno.nroLegajo});

    const curso = (alumno.curso == null) ? '' : await Curso.findOne({ _id: alumno.curso });

    if (alumnoExistente) {
      return res.status(400).send('El número de legajo ya existe');
    }

    if (curso === null) {
      return res.status(400).send('El curso indicado no existe');
    }

    const alumnoCreado = await Alumno.create({ ...alumno, curso: curso._id })

    res.send(alumnoCreado)
  } catch (err) {
    next(err)
  }
}

// Actualizamos un alumno
async function actualizarAlumno(req, res, next) {
  try {
    const alumnoParaActualizar = await Alumno.findById(req.params.id)
    if (!alumnoParaActualizar) {
      return res.status(404).send('Alumno no encontrado')
    }

    // Si cambia el legajo, que no lo tenga otro alumno
    if (req.body.nroLegajo && req.body.nroLegajo !== alumnoParaActualizar.nroLegajo) {
      const legajoUsado = await Alumno.findOne({ nroLegajo: req.body.nroLegajo })
      if (legajoUsado) {
        return res.status(400).send('El número de legajo ya existe')
      }
    }

    // Si viene un curso tiene que existir; si viene vacio el alumno queda sin curso
    if (req.body.curso) {
      const curso = await Curso.findById(req.body.curso)
      if (!curso) {
        return res.status(400).send('El curso indicado no existe')
      }
    } else {
      req.body.curso = null
    }

    // Devuelve el alumno ya actualizado
    const alumnoActualizado = await Alumno.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('curso')
    res.send(alumnoActualizado)
  } catch (err) {
    next(err)
  }
}

//Borramos un alumno
async function borrarAlumno(req, res, next) {

  if (!req.params.id) {
    return res.status(400).send('El parametro Id no esta definido');
  }

  try {
    const alumno = await Alumno.findById(req.params.id);
    
    if (!alumno) {
      return res.status(404).send('Alumno no encontrado');
    }

    // No se borra un alumno con boletines, para no dejar boletines huerfanos
    const cantidadBoletines = await Boletin.countDocuments({ alumno: alumno._id });
    if (cantidadBoletines > 0) {
      return res.status(400).send(`No se puede borrar: el alumno tiene ${cantidadBoletines} boletín(es). Eliminalos primero.`);
    }

    // Ni un alumno que tiene usuario para entrar al sistema
    const cantidadUsuarios = await Usuario.countDocuments({ alumno: alumno._id });
    if (cantidadUsuarios > 0) {
      return res.status(400).send('No se puede borrar: el alumno tiene un usuario para entrar al sistema.');
    }

    await Alumno.deleteOne({ _id: alumno._id });

    res.send(`Alumno Borrado :  ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

module.exports = router