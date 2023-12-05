const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const boletinSchema = new Schema({
  alumno: { type: ObjectId, ref: 'Alumno', required: true },
  curso: { type: ObjectId, ref: 'Curso', required: true },
  notas: { type: Map, of: Number, required: true },
});

const Boletin = mongoose.model('Boletin', boletinSchema);

module.exports = Boletin;