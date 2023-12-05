/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const cursosIniciales = [
    {
        _id: new ObjectId('000000000000000000000000'),
        nombre: '1.001',
        anio: new ObjectId('000000000000000000000000'),
        materias: [ new ObjectId('000000000000000000000000'), new ObjectId('000000000000000000000001')],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000001'),
        nombre: '1.005',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000002'),
        nombre: '2.003',
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