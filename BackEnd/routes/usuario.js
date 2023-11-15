const express = require('express')
const bcrypt = require('bcrypt')

const Usuario = require('../schemas/usuario')
const Rol = require('../schemas/rol')

const router = express.Router()

router.get('/', obtenerTodosUsuarios)
router.get('/:id', obtenerUsuarioPorId)
router.post('/', crearUsuario)
router.put('/:id', actualizarUsuario)
router.delete('/:id', borrarUsuario)

//Obtiene todos los usuario existentes
async function obtenerTodosUsuarios(req, res, next) {
  try {
    const usuarios = await Usuario.find().populate('rol')
    console.log(usuarios)
    res.send(usuarios)
  } catch (err) {
    next(err)
  }
}

// Obtiene un usuario por su Id
async function obtenerUsuarioPorId(req, res, next) {
  console.log('ObtenerUsuario por Id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('El parametro Id no esta definido')
  }

  try {
    const usuario = await Usuario.findById(req.params.id).populate('rol')

    if (!usuario || usuario.length == 0) {
      res.status(404).send('Usuario no encontrado')
    }

    res.send(usuario)
  } catch (err) {
    next(err)
  }
}

// Por Postman
// {
//   "_id": "000000000000000000000000",
//   "email": "admin@baseapinode.com",
//   "password": "Password1",
//   "nombre": "Admin",
//   "apellido": "BaseApiNode",
//   "rol": "admin",
// }
// {
//   "_id": "000000000000000000000001",
//   "email": "client@baseapinode.com",
//   "password": "Password1",
//   "nombre": "Client",
//   "apellido": "BaseApiNode",
//   "rol": "client",
// }

// Creamos un usuario a partir de los datos obtenidos
async function crearUsuario(req, res, next) {
  console.log('crearUsuario: ', req.body)

  const usuario = req.body

  try {
    const rol = await Rol.findOne({ name: usuario.rol })
    if (!rol) {
      res.status(404).send('Rol no encontrado')
    }

    const passEncrypted = await bcrypt.hash(usuario.password, 10)

    const usuarioCreado = await Usuario.create({ ...usuario, password: passEncrypted, rol: rol._id })

    res.send(usuarioCreado)
  } catch (err) {
    next(err)
  }
}

// Actualizamos un usuario
async function actualizarUsuario(req, res, next) {
  console.log('actualizarUsuario con Id: ', req.params.id)

  if (!req.params.id) {
    return res.status(404).send('Parametro Id no encontrado')
  }

  if (!req.isAdmin() && req.params.id != req.usuario._id) {
    return res.status(403).send('No autorizado')
  }

  // The email can't be updated
  delete req.body.email

  try {
    const usuarioParaActualizar = await Usuario.findById(req.params.id)

    if (!usuarioParaActualizar) {
      req.logger.error('Usuario no encontrado')
      return res.status(404).send('Usuario no encontrado')
    }

    if (req.body.rol) {
      const nuevoRol = await Rol.findById(req.body.rol)

      if (!nuevoRol) {
        req.logger.verbose('Nuevo rol no encontrado. Enviando 400 al cliente')
        return res.status(400).end()
      }
      req.body.rol = nuevoRol._id
    }

    if (req.body.password) {
      const passEncrypted = await bcrypt.hash(req.body.password, 10)
      req.body.password = passEncrypted
    }

    // This will return the previous status
    await usuarioParaActualizar.updateOne(req.body)
    res.send(usuarioParaActualizar)

    // This return the current status
    // usuarioParaActualizar.nombre = req.body.nombre
    // usuarioParaActualizar.apellido = req.body.apellido
    // usuarioParaActualizar.rol = req.body.rol
    // usuarioParaActualizar.password = req.body.password
    // await usuarioParaActualizar.save()
    // res.send(usuarioParaActualizar)
  } catch (err) {
    next(err)
  }
}

//Borramos un usuario
async function borrarUsuario(req, res, next) {
  console.log('borrarUsuario con Id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('El parametro Id no esta definido')
  }

  try {
    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) {
      res.status(404).send('Usuario no encontrado')
    }

    await Usuario.deleteOne({ _id: usuario._id })

    res.send(`Usuario Borrado :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

module.exports = router
