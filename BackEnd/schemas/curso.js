const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const cursoSchema = new Schema({
    nombre:   { type: String, required: true, lowercase: true, trim: true },
    anio:     {type : ObjectId, ref: 'Anio'},
    materias: [{ type: ObjectId, ref: 'Materia' }],
})

const Curso = mongoose.model('Curso', cursoSchema)

module.exports = Curso