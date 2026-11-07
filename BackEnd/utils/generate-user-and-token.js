const jwt = require('jsonwebtoken')

const Rol = require('../schemas/rol')

// Arma el token JWT y los datos del usuario que se devuelven al loguearse
async function generateUserToken(req, usuario) {
  const rol = await Rol.findById(usuario.rol).exec()

  const payload = {
    _id: usuario._id,
    rol: rol.descripcion,
  }

  // Si es un usuario alumno, el token lleva a que alumno corresponde (asi solo ve lo suyo)
  if (usuario.alumno) {
    payload.alumno = usuario.alumno
  }

  const userResponse = {
    _id: usuario._id,
    rol: rol.descripcion,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
  }

  // El secreto, el emisor y la duracion salen del .env
  /* eslint-disable no-undef */
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    subject: usuario._id.toString(),
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  })
  /* eslint-enable no-undef */

  return { token, usuario: userResponse }
}

module.exports = generateUserToken
