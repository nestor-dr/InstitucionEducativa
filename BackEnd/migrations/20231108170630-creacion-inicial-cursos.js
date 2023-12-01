/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const cursosIniciales = [
    // Cursos del Primer año
    {
        _id: new ObjectId('000000000000000000000000'),
        nombre: '1.601',
        anio: new ObjectId('000000000000000000000000'),
        materias: [ new ObjectId('000000000000000000000000'), new ObjectId('000000000000000000000001')],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000001'),
        nombre: '1.602',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000002'),
        nombre: '1.603',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000003'),
        nombre: '1.604',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // Cursos del Segundo año
    {
        _id: new ObjectId('000000000000000000000004'),
        nombre: '2.601',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000005'),
        nombre: '2.602',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000006'),
        nombre: '2.603',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // Cursos del Tercer año
    {
        _id: new ObjectId('000000000000000000000007'),
        nombre: '3.601',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000008'),
        nombre: '3.602',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000009'),
        nombre: '3.603',
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