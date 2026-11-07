const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const Usuario = require('../schemas/usuario')
const Rol = require('../schemas/rol')
const Alumno = require('../schemas/alumno')
const permitirRoles = require('../middlewares/authorization')

const router = express.Router()

router.get('/', permitirRoles('admin'), obtenerTodosUsuarios)
router.get('/:id', obtenerUsuarioPorId)
router.post('/', permitirRoles('admin'), crearUsuario)
router.put('/:id', actualizarUsuario)
router.delete('/:id', permitirRoles('admin'), borrarUsuario)

// El admin puede ver/editar a cualquiera, el resto solo a si mismo
function esAdminOPropio(req) {
  return req.user.rol === 'admin' || req.params.id === req.user._id
}

// Contraseña: minimo 8 caracteres, con al menos una letra y un numero
function passwordValida(password) {
  return typeof password === 'string' && password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password)
}
const MENSAJE_PASSWORD = 'La contraseña tiene que tener al menos 8 caracteres, con letras y números'

// Email con formato valido (algo@algo.algo)
function emailValido(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// Busca el rol por su id o por su descripcion (admin / profesor / alumno)
async function buscarRol(rol) {
  if (!rol) return null
  return mongoose.isValidObjectId(rol) ? await Rol.findById(rol) : await Rol.findOne({ descripcion: rol })
}

// Para el rol alumno: el alumno tiene que existir y no tener otro usuario
// Devuelve el mensaje de error o null si esta todo bien
async function validarAlumnoVinculado(alumnoId, idUsuarioActual) {
  const alumno = alumnoId && mongoose.isValidObjectId(alumnoId) ? await Alumno.findById(alumnoId) : null
  if (!alumno) {
    return 'Para el rol alumno hay que elegir un alumno que exista'
  }
  const otroUsuario = await Usuario.findOne({ alumno: alumno._id, _id: { $ne: idUsuarioActual } })
  if (otroUsuario) {
    return 'Ese alumno ya tiene un usuario'
  }
  return null
}

//Obtiene todos los usuario existentes
async function obtenerTodosUsuarios(req, res, next) {
  try {
    const usuarios = await Usuario.find().populate('rol').populate('alumno').sort({ apellido: 1, nombre: 1 }).collation({ locale: 'es' })
    res.send(usuarios)
  } catch (err) {
    next(err)
  }
}

// Obtiene un usuario por su Id
async function obtenerUsuarioPorId(req, res, next) {
  if (!esAdminOPropio(req)) {
    return res.status(403).send('No tenés permiso para ver este usuario')
  }

  try {
    const usuario = await Usuario.findById(req.params.id).populate('rol').populate('alumno')

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado')
    }

    res.send(usuario)
  } catch (err) {
    next(err)
  }
}

// Por Postman
// {
//   "email": "nuevo@baseapinode.com",
//   "password": "Password1",
//   "nombre": "Nuevo",
//   "apellido": "Usuario",
//   "rol": "profesor"
// }
// Para un alumno: "rol": "alumno", "alumno": "<_id del alumno>"

// Creamos un usuario a partir de los datos obtenidos
async function crearUsuario(req, res, next) {
  console.log('crearUsuario: ', req.body.email)

  const usuario = req.body

  try {
    if (!emailValido(usuario.email)) {
      return res.status(400).send('El email no tiene un formato válido')
    }

    const existente = await Usuario.findOne({ email: usuario.email.toLowerCase().trim() })
    if (existente) {
      return res.status(400).send('Ya existe un usuario con ese email')
    }

    if (!passwordValida(usuario.password)) {
      return res.status(400).send(MENSAJE_PASSWORD)
    }

    const rol = await buscarRol(usuario.rol)
    if (!rol) {
      return res.status(400).send('El rol indicado no existe')
    }

    // Un usuario alumno tiene que estar vinculado a un alumno que no tenga usuario
    if (rol.descripcion === 'alumno') {
      const errorAlumno = await validarAlumnoVinculado(usuario.alumno)
      if (errorAlumno) {
        return res.status(400).send(errorAlumno)
      }
    } else {
      delete usuario.alumno
    }

    const passEncrypted = await bcrypt.hash(usuario.password, 10)

    const usuarioCreado = await Usuario.create({ ...usuario, password: passEncrypted, rol: rol._id })

    req.logger.info(`Usuario ${usuarioCreado.email} creado por el usuario ${req.user._id}`)
    res.status(201).send(usuarioCreado)
  } catch (err) {
    next(err)
  }
}

// Actualizamos un usuario
async function actualizarUsuario(req, res, next) {
  console.log('actualizarUsuario con Id: ', req.params.id)

  if (!esAdminOPropio(req)) {
    return res.status(403).send('No tenés permiso para modificar este usuario')
  }

  // El email no se puede cambiar; el rol y el alumno vinculado solo los cambia un admin
  delete req.body.email
  if (req.user.rol !== 'admin') {
    delete req.body.rol
    delete req.body.alumno
  }

  try {
    const usuarioParaActualizar = await Usuario.findById(req.params.id).populate('rol')

    if (!usuarioParaActualizar) {
      return res.status(404).send('Usuario no encontrado')
    }

    // Rol final: el nuevo si vino, si no el que ya tenia
    let rolFinal = usuarioParaActualizar.rol
    if (req.body.rol) {
      rolFinal = await buscarRol(req.body.rol)
      if (!rolFinal) {
        return res.status(400).send('El rol indicado no existe')
      }
      req.body.rol = rolFinal._id
    }

    // El admin no se puede sacar a si mismo el rol de admin (asi nunca queda el sistema sin admin)
    if (req.params.id === req.user._id && rolFinal.descripcion !== 'admin' && req.user.rol === 'admin') {
      return res.status(400).send('No podés sacarte el rol de administrador a vos mismo')
    }

    // Si queda como alumno tiene que tener un alumno vinculado; si no, se desvincula
    if (rolFinal.descripcion === 'alumno') {
      const alumnoId = req.body.alumno || usuarioParaActualizar.alumno
      const errorAlumno = await validarAlumnoVinculado(alumnoId, usuarioParaActualizar._id)
      if (errorAlumno) {
        return res.status(400).send(errorAlumno)
      }
      req.body.alumno = alumnoId
    } else if (req.user.rol === 'admin') {
      req.body.alumno = null
    }

    // Contraseña nueva (opcional): se valida y se guarda hasheada
    if (req.body.password) {
      if (!passwordValida(req.body.password)) {
        return res.status(400).send(MENSAJE_PASSWORD)
      }
      req.body.password = await bcrypt.hash(req.body.password, 10)
    } else {
      delete req.body.password
    }

    // Devuelve el usuario ya actualizado
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('rol').populate('alumno')
    res.send(usuarioActualizado)
  } catch (err) {
    next(err)
  }
}

//Borramos un usuario
async function borrarUsuario(req, res, next) {
  console.log('borrarUsuario con Id: ', req.params.id)

  // El admin no se puede borrar a si mismo (asi nunca queda el sistema sin admin)
  if (req.params.id === req.user._id) {
    return res.status(400).send('No podés borrar tu propio usuario')
  }

  try {
    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado')
    }

    await Usuario.deleteOne({ _id: usuario._id })

    req.logger.info(`Usuario ${usuario.email} borrado por el usuario ${req.user._id}`)
    res.send(`Usuario Borrado :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

module.exports = router
