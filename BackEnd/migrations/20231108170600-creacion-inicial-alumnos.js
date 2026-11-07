/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

// El campo curso apunta a los _id de la migracion de cursos
const alumnosIniciales = [
    {
      _id: new ObjectId('000000000000000000000000'),
      nombre: 'Nestor',
      apellido: 'del Rio',
      nroLegajo: '000001',
      direccion: 'Dorsi 330',
      edad: 25,
      curso: new ObjectId('000000000000000000000000'), // 1.001
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
        curso: new ObjectId('000000000000000000000002'), // 2.003
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
        curso: new ObjectId('000000000000000000000001'), // 1.005
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000003'),
        nombre: 'Maria',
        apellido: 'Gomez',
        nroLegajo: '000027',
        direccion: 'Belgrano 845',
        edad: 19,
        curso: new ObjectId('000000000000000000000000'), // 1.001
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000004'),
        nombre: 'Lucia',
        apellido: 'Fernandez',
        nroLegajo: '000034',
        direccion: 'San Martin 512',
        edad: 22,
        curso: new ObjectId('000000000000000000000003'), // 3.002
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
