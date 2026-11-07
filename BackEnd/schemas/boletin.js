const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

// Una nota del boletin: la materia y la calificacion (1 a 10)
const notaSchema = new Schema({
  materia: { type: ObjectId, ref: 'Materia', required: true },
  nota:    { type: Number, required: true, min: [1, 'La nota mínima es 1'], max: [10, 'La nota máxima es 10'] },
}, { _id: false })

const boletinSchema = new Schema({
  alumno: { type: ObjectId, ref: 'Alumno', required: true },
  curso:  { type: ObjectId, ref: 'Curso', required: true },
  notas:  { type: [notaSchema], validate: [(notas) => notas.length > 0, 'El boletín tiene que tener al menos una nota'] },
}, {
  timestamps: true, // agrega createdAt y updatedAt
  collection: 'boletines',
  toJSON: { virtuals: true }, // para que el promedio viaje al front
})

// Un solo boletin por alumno y curso
boletinSchema.index({ alumno: 1, curso: 1 }, { unique: true })

// Promedio de las notas, redondeado a 2 decimales (se calcula, no se guarda)
boletinSchema.virtual('promedio').get(function () {
  if (!this.notas || this.notas.length === 0) return null
  const suma = this.notas.reduce((total, item) => total + item.nota, 0)
  return Math.round((suma / this.notas.length) * 100) / 100
})

const Boletin = mongoose.model('Boletin', boletinSchema)

module.exports = Boletin
