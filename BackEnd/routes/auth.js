const { Router } = require('express')
const Usuario = require('../schemas/usuario')

const generateUserToken = require('../utils/generate-user-and-token')

const router = new Router()

router.post('/', createUserToken)

// Valida email y contraseña y devuelve el token
async function createUserToken(req, res, next) {
  console.log(`Creating user token for ${req.body.email}`)

  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Ingresá el email y la contraseña')
  }

  try {
    const usuario = await Usuario.findOne({ email: req.body.email.toLowerCase().trim() }, '+password')

    if (!usuario) {
      return res.status(401).send('El email o la contraseña no son correctos')
    }

    const result = await usuario.checkPassword(req.body.password)

    if (!result.isOk) {
      return res.status(401).send('El email o la contraseña no son correctos')
    }

    const response = await generateUserToken(req, usuario)

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

module.exports = router
