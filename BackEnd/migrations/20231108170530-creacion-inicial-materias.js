/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const materiasIniciales = [
    // Materias de Primer Año
    {
        _id: new ObjectId('000000000000000000000000'),
        nombre: 'Análisis Matemático I',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000001'),
        nombre: 'Álgebra, Probabilidades y Estadística',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000002'),
        nombre: 'Laboratorio',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000003'),
        nombre: 'Programación I',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000004'),
        nombre: 'Inglés Técnico I',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000005'),
        nombre: 'Economía y Organización',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000006'),
        nombre: 'Complementos de Física y Química',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // Materias de Segundo Año
    {
        _id: new ObjectId('000000000000000000000007'),
        nombre: 'Modelos Discretos',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000008'),
        nombre: 'Análisis Matemático II',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000009'),
        nombre: 'Programación II',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000010'),
        nombre: 'Sistemas de Computación I',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000011'),
        nombre: 'Estructura y Base de Datos',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000012'),
        nombre: 'Inglés Técnico II',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // Materias Tercer Año
    {
        _id: new ObjectId('000000000000000000000013'),
        nombre: 'Probabilidad Aplicada',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000014'),
        nombre: 'Técnicas Digitales / Página Web',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000015'),
        nombre: 'Programación III',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000016'),
        nombre: 'Sistemas de Computación II',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000017'),
        nombre: 'Seminario',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000018'),
        nombre: 'Inglés Técnico III',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new ObjectId('000000000000000000000019'),
        nombre: 'Problemática de la Realidad Contemporánea',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

module.exports = {
    async up(db, client) {
        await db.collection('materias').insertMany(materiasIniciales)
    },

    async down(db, client) {
        await db.collection('materias').deleteMany({
            _id: {
                $in: materiasIniciales.map((materia) => materia._id),
            },
        })
    },
}