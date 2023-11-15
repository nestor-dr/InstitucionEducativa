/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const cursosIniciales = [
    {
      _id: new ObjectId('000000000000000000000000'),
      nombre: '1.601',
      materia: new ObjectId('000000000000000000000000'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000001'),
      nombre: '2.602',
      materia: new ObjectId('000000000000000000000001'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000002'),
      nombre: '3.603',
      materia: new ObjectId('000000000000000000000002'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

module.exports = {
    async up(db, client) {
      await db.collection('cursos').insertMany(cursosIniciales)
    },
  
    async down(db, client) {
      await db.collection('cursos').deleteMany({
        _id: {
          $in: cursosIniciales.map((curso) => curso._id),
        },
      })
    },
  }