const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const cursoSchema = new Schema({
    nombre: { type: String, required: true, lowercase: true, trim: true},
    materia: { type: ObjectId, ref: 'Materia', required: true}
})

const Curso = mongoose.model('Curso', cursoSchema)

module.exports = Curso