const mongoose = require('mongoose')

const { Schema } = mongoose

const materiaSchema = new Schema({
    nombre: { type: String, required: true, lowercase: true, trim: true }
})

const Materia = mongoose.model('Materia', materiaSchema)

module.exports = Materia