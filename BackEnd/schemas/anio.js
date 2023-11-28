const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const anioSchema = new Schema({
    nombre:   { type: String, required: true, lowercase: true, trim: true },
    cursos:   [{ type: ObjectId, ref: 'Curso' }],
    materias: [{ type: ObjectId, ref: 'Materia' }]
})

const Anio = mongoose.model('Anio', anioSchema)

module.exports = Anio