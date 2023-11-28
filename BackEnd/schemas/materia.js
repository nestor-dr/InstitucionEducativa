const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const materiaSchema = new Schema({
    nombre: { type: String, required: true, lowercase: true, trim: true },
    anio:   { type: ObjectId, ref: 'Anio' },
    cursos: [{ type: ObjectId, ref: 'Curso' }]
})

const Materia = mongoose.model('Materia', materiaSchema)

module.exports = Materia