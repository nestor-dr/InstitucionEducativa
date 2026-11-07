const mongoose = require('mongoose')

const { Schema } = mongoose

// El nombre se guarda tal cual se escribe (sin pasar a minusculas) para respetar mayusculas y acentos
const materiaSchema = new Schema({
    nombre: { type: String, required: true, trim: true }
})

const Materia = mongoose.model('Materia', materiaSchema)

module.exports = Materia
