/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

// Tercer rol: el alumno entra a ver solo su boletin
const rolAlumno = {
  _id: new ObjectId('000000000000000000000002'),
  descripcion: 'alumno',
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Usuario de prueba vinculado a Nestor del Rio (que ya tiene boletin)
const usuarioAlumno = {
  _id: new ObjectId('000000000000000000000003'),
  email: 'ndelrio@baseapinode.com',
  password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
  nombre: 'Nestor',
  apellido: 'del Rio',
  rol: rolAlumno._id,
  alumno: new ObjectId('000000000000000000000000'), // Nestor del Rio
  createdAt: new Date(),
  updatedAt: new Date(),
}

module.exports = {
  async up(db, client) {
    await db.collection('roles').insertOne(rolAlumno)
    await db.collection('usuarios').insertOne(usuarioAlumno)
  },

  async down(db, client) {
    await db.collection('usuarios').deleteOne({ _id: usuarioAlumno._id })
    await db.collection('roles').deleteOne({ _id: rolAlumno._id })
  },
}
