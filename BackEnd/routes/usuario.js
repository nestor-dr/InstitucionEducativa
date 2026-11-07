const express = require('express')
const bcrypt = require('bcrypt')

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

//Obtiene todos los usuario existentes
async function obtenerTodosUsuarios(req, res, next) {
  try {
    const usuarios = await Usuario.find().populate('rol')
    res.send(usuarios)
  } catch (err) {
    next(err)
  }
}

// Obtiene un usuario por su Id
async function obtenerUsuarioPorId(req, res, next) {
  console.log('ObtenerUsuario por Id: ', req.params.id)

  if (!esAdminOPropio(req)) {
    return res.status(403).send('No tenés permiso para ver este usuario')
  }

  try {
    const usuario = await Usuario.findById(req.params.id).populate('rol')

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
    // El rol llega por su descripcion (admin / profesor / alumno)
    const rol = await Rol.findOne({ descripcion: usuario.rol })
    if (!rol) {
      return res.status(404).send('Rol no encontrado')
    }

    // Un usuario alumno tiene que estar vinculado a un alumno que exista
    if (rol.descripcion === 'alumno') {
      const alumno = usuario.alumno ? await Alumno.findById(usuario.alumno) : null
      if (!alumno) {
        return res.status(400).send('Para el rol alumno hay que indicar un alumno que exista')
      }
    } else {
      delete usuario.alumno
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
    const usuarioParaActualizar = await Usuario.findById(req.params.id)

    if (!usuarioParaActualizar) {
      return res.status(404).send('Usuario no encontrado')
    }

    if (req.body.rol) {
      const nuevoRol = await Rol.findById(req.body.rol)

      if (!nuevoRol) {
        return res.status(400).send('El rol indicado no existe')
      }
      req.body.rol = nuevoRol._id
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    } else {
      delete req.body.password
    }

    // Devuelve el usuario ya actualizado
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('rol')
    res.send(usuarioActualizado)
  } catch (err) {
    next(err)
  }
}

//Borramos un usuario
async function borrarUsuario(req, res, next) {
  console.log('borrarUsuario con Id: ', req.params.id)

  try {
    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado')
    }

    await Usuario.deleteOne({ _id: usuario._id })

    res.send(`Usuario Borrado :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

module.exports = router
