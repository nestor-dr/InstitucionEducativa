/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const alumnosIniciales = [
    {
      _id: new ObjectId('000000000000000000000000'),
      nombre: 'Nestor',
      apellido: 'del Rio',
      nroLegajo: '151600',
      direccion: 'Calle 1 123',
      edad: 18,
      curso: new ObjectId('000000000000000000000000'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000001'),
        nombre: 'Juan',
        apellido: 'Perez',
        nroLegajo: '144870',
        direccion: 'Calle 2 456',
        edad: 20,
        curso: new ObjectId('000000000000000000000000'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000002'),
        nombre: 'Pedro',
        apellido: 'Diaz',
        nroLegajo: '130750',
        direccion: 'Calle 10 321',
        edad: 18,
        curso: new ObjectId('000000000000000000000001'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000003'),
        nombre: 'Rodrigo',
        apellido: 'Martinez',
        nroLegajo: '150500',
        direccion: 'Calle 4 789',
        edad: 21,
        curso: new ObjectId('000000000000000000000002'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
  ]

module.exports = {
    async up(db, client) {
      await db.collection('alumnos').insertMany(alumnosIniciales)
    },
  
    async down(db, client) {
      await db.collection('alumnos').deleteMany({
        _id: {
          $in: alumnosIniciales.map((alumno) => alumno._id),
        },
      })
    },
  }