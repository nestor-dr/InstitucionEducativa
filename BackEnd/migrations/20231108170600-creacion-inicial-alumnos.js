/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const alumnosIniciales = [
    {
      _id: new ObjectId('000000000000000000000000'),
      nombre: 'Nestor',
      apellido: 'del Rio',
      nroLegajo: '151600',
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
        nroLegajo: '144870',
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
        nroLegajo: '130750',
        direccion: 'Rivadavia 1002',
        edad: 18,
        curso: new ObjectId('000000000000000000000008'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000003'),
        nombre: 'Rodrigo',
        apellido: 'Martinez',
        nroLegajo: '150500',
        direccion: 'Callao 1050',
        edad: 21,
        curso: new ObjectId('000000000000000000000007'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
      _id: new ObjectId('000000000000000000000004'),
      nombre: 'Mariana',
      apellido: 'Dominguez',
      nroLegajo: '75000',
      direccion: '9 de Julio 154',
      edad: 34,
      curso: new ObjectId('000000000000000000000008'),
      createdAt: new Date(),
      updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000005'),
    nombre: 'Julia',
    apellido: 'Castillo',
    nroLegajo: '35740',
    direccion: 'Belgrano 340',
    edad: 29,
    curso: new ObjectId('000000000000000000000001'),
    createdAt: new Date(),
    updatedAt: new Date(),
},
{
  _id: new ObjectId('000000000000000000000006'),
  nombre: 'Martin',
  apellido: 'Lopez',
  nroLegajo: '170305',
  direccion: 'Sarmiento',
  edad: 45,
  curso: new ObjectId('000000000000000000000003'),
  createdAt: new Date(),
  updatedAt: new Date(),
},
{
  _id: new ObjectId('000000000000000000000007'),
  nombre: 'Ana',
  apellido: 'Martinez',
  nroLegajo: '151747',
  direccion: 'Cardoner 976',
  edad: 33,
  curso: new ObjectId('000000000000000000000007'),
  createdAt: new Date(),
  updatedAt: new Date(),
},
{
  _id: new ObjectId('000000000000000000000008'),
  nombre: 'Marta',
  apellido: 'Ramirez',
  nroLegajo: '150505',
  direccion: 'Alem 1245',
  edad: 21,
  curso: new ObjectId('000000000000000000000000'),
  createdAt: new Date(),
  updatedAt: new Date(),
},
{
  _id: new ObjectId('000000000000000000000009'),
  nombre: 'Leon',
  apellido: 'Pedroti',
  nroLegajo: '150506',
  direccion: 'Fortunato Diaz 567',
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