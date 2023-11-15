/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const materiasIniciales = [
    {
      _id: new ObjectId('000000000000000000000000'),
      nombre: 'Matematicas',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000001'),
      nombre: 'Fisica',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000002'),
      nombre: 'Quimica',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000003'),
      nombre: 'Arte',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

module.exports = {
    async up(db, client) {
      await db.collection('materias').insertMany(materiasIniciales)
    },
  
    async down(db, client) {
      await db.collection('materias').deleteMany({
        _id: {
          $in: materiasIniciales.map((materia) => materia._id),
        },
      })
    },
  }