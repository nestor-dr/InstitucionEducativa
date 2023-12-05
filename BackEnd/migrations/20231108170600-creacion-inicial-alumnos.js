/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const alumnosIniciales = [
    {
      _id: new ObjectId('000000000000000000000000'),
      nombre: 'Nestor',
      apellido: 'del Rio',
      nroLegajo: '000001',
      direccion: 'Dorsi 330',
      edad: 25,
      curso: new ObjectId('000000000000000000000000'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000001'),
        nombre: 'Juan',
        apellido: 'Perez',
        nroLegajo: '000012',
        direccion: 'Entre Rios 1243',
        edad: 20,
        curso: new ObjectId('000000000000000000000002'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000002'),
        nombre: 'Pedro',
        apellido: 'Diaz',
        nroLegajo: '000053',
        direccion: 'Rivadavia 1002',
        edad: 18,
        curso: new ObjectId('000000000000000000000008'),
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