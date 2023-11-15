const mongoose = require('mongoose')

const { Schema } = mongoose

const rolSchema = new Schema({
  descripcion: { type: String, required: true, lowercase: true, trim: true, unique: true },
})

const Rol = mongoose.model('Roles', rolSchema)

module.exports = Rol