const express = require('express')

const Rol = require('../schemas/rol')

const router = express.Router()

router.get('/', obtenerTodosRoles)

//Obtiene todos los roles (para elegir el rol al crear o modificar un usuario)
async function obtenerTodosRoles(req, res, next) {
  try {
    const roles = await Rol.find().sort({ descripcion: 1 })
    res.send(roles)
  } catch (err) {
    next(err)
  }
}

module.exports = router
