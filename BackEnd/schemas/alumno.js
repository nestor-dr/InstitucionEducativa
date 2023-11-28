const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const alumnoSchema = new Schema({
    nombre:    { type: String, required: true, lowercase: true, trim: true},
    apellido:  { type: String, required: true, lowercase: true, trim: true},
    nroLegajo: { type: String, unique: true, /*Asegura que el número de legajo sea único*/ required: true, lowercase: true, trim: true},
    direccion: { type: String, required: true, trim: true},
    edad:      { type: Number, required: true},
    curso:     {type : ObjectId, ref: 'Curso'}
})

const Alumno = mongoose.model('Alumno', alumnoSchema)

module.exports = Alumno