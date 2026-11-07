const jwt = require('jsonwebtoken')
const createError = require('http-errors')

// Saca el token del header "Authorization: Bearer <token>"
function obtenerToken(req) {
  const [tipo, token] = (req.headers.authorization || '').split(' ')
  return tipo === 'Bearer' && token ? token : null
}

// Verifica el token y deja los datos del usuario en req.user
function authentication(req, res, next) {
  const token = obtenerToken(req)

  if (!token) {
    return next(new createError.Unauthorized('Falta el token de acceso'))
  }

  try {
    /* eslint-disable-next-line no-undef */
    req.user = jwt.verify(token, process.env.JWT_SECRET, { issuer: process.env.JWT_ISSUER })

    if (!req.user._id || !req.user.rol) {
      return next(new createError.Unauthorized('Token mal formado'))
    }

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new createError.Unauthorized('La sesión expiró, volvé a iniciar sesión'))
    }
    return next(new createError.Unauthorized('Token inválido'))
  }
}

module.exports = authentication
