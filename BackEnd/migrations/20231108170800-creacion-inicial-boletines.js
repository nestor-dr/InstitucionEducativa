/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

// Arma el ObjectId de una materia de la migracion de materias (ej: '07' -> '000...007')
const idMateria = (numero) => new ObjectId(`00000000000000000000${numero.padStart(4, '0')}`)

// Boletines de ejemplo: cada nota es de una materia del curso del alumno
const boletinesIniciales = [
  {
    _id: new ObjectId('000000000000000000000000'),
    alumno: new ObjectId('000000000000000000000000'), // Nestor del Rio
    curso: new ObjectId('000000000000000000000000'), // 1.001 (1° año)
    notas: [
      { materia: idMateria('00'), nota: 8 },
      { materia: idMateria('01'), nota: 7 },
      { materia: idMateria('02'), nota: 9 },
      { materia: idMateria('03'), nota: 10 },
      { materia: idMateria('04'), nota: 6 },
      { materia: idMateria('05'), nota: 7.5 },
      { materia: idMateria('06'), nota: 8 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    alumno: new ObjectId('000000000000000000000001'), // Juan Perez
    curso: new ObjectId('000000000000000000000002'), // 2.003 (2° año)
    notas: [
      { materia: idMateria('07'), nota: 6 },
      { materia: idMateria('08'), nota: 4 },
      { materia: idMateria('09'), nota: 9 },
      { materia: idMateria('10'), nota: 7 },
      { materia: idMateria('11'), nota: 8 },
      { materia: idMateria('12'), nota: 5 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = {
  async up(db, client) {
    await db.collection('boletines').insertMany(boletinesIniciales)
    // Un solo boletin por alumno y curso (el mismo indice que define el schema)
    await db.collection('boletines').createIndex({ alumno: 1, curso: 1 }, { unique: true })
  },

  async down(db, client) {
    await db.collection('boletines').deleteMany({
      _id: {
        $in: boletinesIniciales.map((boletin) => boletin._id),
      },
    })
  },
}
