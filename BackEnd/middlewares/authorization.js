const createError = require('http-errors')

// Deja pasar solo a los usuarios que tengan alguno de los roles indicados
// Ej: router.post('/', permitirRoles('admin'), crearAlumno)
function permitirRoles(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.rol)) {
      return next(new createError.Forbidden('No tenés permiso para realizar esta acción'))
    }
    next()
  }
}

module.exports = permitirRoles
