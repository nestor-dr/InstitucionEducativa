/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const usuariosIniciales = [
  {
    _id: new ObjectId('000000000000000000000000'),
    email: 'admin@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    nombre: 'Admin',
    apellido: 'BaseApi',
    rol: new ObjectId('000000000000000000000000'), // Admin
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    email: 'glarriera@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    nombre: 'Gaston',
    apellido: 'Larriera',
    rol: new ObjectId('000000000000000000000001'), // Profesor
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000002'),
    email: 'clopez@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    nombre: 'Carlos',
    apellido: 'Lopez',
    rol: new ObjectId('000000000000000000000001'), // Profesor
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = {
  async up(db, client) {
    await db.collection('usuarios').insertMany(usuariosIniciales)
  },

  async down(db, client) {
    await db.collection('usuarios').deleteMany({
      _id: {
        $in: usuariosIniciales.map((usuario) => usuario._id),
      },
    })
  },
}
