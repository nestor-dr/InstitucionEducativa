const mongoose = require('mongoose')

const { Schema } = mongoose

const anioSchema = new Schema({
    nombre:   { type: String, required: true, lowercase: true, trim: true }
})

const Anio = mongoose.model('Anio', anioSchema)

module.exports = Anio