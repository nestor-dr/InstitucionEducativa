/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const aniosIniciales = [
    {
      _id: new ObjectId('000000000000000000000000'),
      nombre: '1° Primer Año',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000001'),
      nombre: '2° Segundo Año',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000002'),
      nombre: '3° Tercer Año',
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