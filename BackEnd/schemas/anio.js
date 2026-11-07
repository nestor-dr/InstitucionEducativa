const mongoose = require('mongoose')

const { Schema } = mongoose

// El nombre se guarda tal cual se escribe (ej: "1° Primer Año")
const anioSchema = new Schema({
    nombre:   { type: String, required: true, trim: true }
})

const Anio = mongoose.model('Anio', anioSchema)

module.exports = Anio
