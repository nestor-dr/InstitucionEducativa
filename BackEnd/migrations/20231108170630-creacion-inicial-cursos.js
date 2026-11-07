/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

// Arma el ObjectId de una materia de la migracion de materias (ej: '07' -> '000...007')
const idMateria = (numero) => new ObjectId(`00000000000000000000${numero.padStart(4, '0')}`)

// Materias de cada año (ver migracion de materias)
const materiasPrimerAnio = ['00', '01', '02', '03', '04', '05', '06'].map(idMateria)
const materiasSegundoAnio = ['07', '08', '09', '10', '11', '12'].map(idMateria)
const materiasTercerAnio = ['13', '14', '15', '16', '17', '18', '19'].map(idMateria)

const cursosIniciales = [
    {
        _id: new ObjectId('000000000000000000000000'),
        nombre: '1.001',
        anio: new ObjectId('000000000000000000000000'), // 1° Primer Año
        materias: materiasPrimerAnio,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000001'),
        nombre: '1.005',
        anio: new ObjectId('000000000000000000000000'), // 1° Primer Año
        materias: materiasPrimerAnio,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000002'),
        nombre: '2.003',
        anio: new ObjectId('000000000000000000000001'), // 2° Segundo Año
        materias: materiasSegundoAnio,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000003'),
        nombre: '3.002',
        anio: new ObjectId('000000000000000000000002'), // 3° Tercer Año
        materias: materiasTercerAnio,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
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
