/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const aniosIniciales = [
    {
      _id: new ObjectId('000000000000000000000000'),
      nombre: 'Primer Anio',
      materia: new ObjectId('000000000000000000000001'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000001'),
      nombre: 'Segundo Anio',
      materia: new ObjectId('000000000000000000000003'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000002'),
      nombre: 'Tercer Anio',
      materia: new ObjectId('000000000000000000000000'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

module.exports = {
    async up(db, client) {
      await db.collection('anios').insertMany(aniosIniciales)
    },
  
    async down(db, client) {
      await db.collection('anios').deleteMany({
        _id: {
          $in: aniosIniciales.map((anio) => anio._id),
        },
      })
    },
  }