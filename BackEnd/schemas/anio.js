const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const anioSchema = new Schema({
    nombre: { type: String, required: true, lowercase: true, trim: true},
    materia: { type: ObjectId, ref: 'Materia', required: true}
})

const Anio = mongoose.model('Anio', anioSchema)

module.exports = Anio