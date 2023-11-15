/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const rolesIniciales = [
  {
    _id: new ObjectId('000000000000000000000000'),
    descripcion: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    descripcion: 'profesor',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = {
  async up(db, client) {
    await db.collection('roles').insertMany(rolesIniciales)
  },

  async down(db, client) {
    await db.collection('roles').deleteMany({
      _id: {
        $in: rolesIniciales.map((rol) => rol._id),
      },
    })
  },
}
