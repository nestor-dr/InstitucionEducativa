const jwt = require('jsonwebtoken')
// const fs = require('fs')
// const path = require('path')

const Rol = require('../schemas/rol')

async function generateUserToken(req, usuario) {
  const rol = await Rol.findById(usuario.rol).exec()
  console.log(usuario)
  console.log(rol)
  const payload = {
    _id: usuario._id,
    rol: rol.descripcion,
  }

  const userResponse = {
    _id: usuario._id,
    rol: rol.descripcion,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
  }

  /* eslint-disable-next-line no-undef */
  // const privateKey = fs.readFileSync(path.join(__dirname, `../keys/base-api-express-generator.pem`))

  // Unsecure alternative
  const token = jwt.sign(payload, 'backend', {
    subject: usuario._id.toString(),
    issuer: 'backend',
  })

  // const token = jwt.sign(payload, privateKey, {
  //   subject: user._id.toString(),
  //   issuer: 'base-api-express-generator',
  //   algorithm: 'RS256',
  // })
  return { token, usuario: userResponse }
}

module.exports = generateUserToken