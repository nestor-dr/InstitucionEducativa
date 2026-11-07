/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

// 36 alumnos mas para que se note la paginacion y la busqueda en los listados
// Los _id van del ...0100 en adelante (en hexadecimal) para no chocar con los alumnos iniciales
const nombres = ['Sofia', 'Mateo', 'Valentina', 'Santiago', 'Martina', 'Benjamin', 'Catalina', 'Thiago', 'Emilia', 'Joaquin', 'Delfina', 'Tomas']
const apellidos = ['Gonzalez', 'Rodriguez', 'Martinez', 'Garcia', 'Sanchez', 'Romero', 'Sosa', 'Alvarez', 'Torres', 'Ruiz', 'Benitez', 'Acosta']
const calles = ['Sarmiento', 'Belgrano', 'Mitre', 'Moreno', 'Urquiza', 'Alberdi']

// Cursos de la migracion de cursos: 1.001, 1.005, 2.003 y 3.002
const cursos = ['000000000000000000000000', '000000000000000000000001', '000000000000000000000002', '000000000000000000000003']

const alumnosPaginacion = Array.from({ length: 36 }, (valor, i) => ({
  _id: new ObjectId((0x100 + i).toString(16).padStart(24, '0')),
  nombre: nombres[i % nombres.length],
  apellido: apellidos[(i + Math.floor(i / nombres.length) * 5) % apellidos.length], // sin repetir nombre + apellido
  nroLegajo: String(100 + i).padStart(6, '0'),
  direccion: `${calles[i % calles.length]} ${100 + i * 17}`,
  edad: 18 + (i % 8),
  curso: new ObjectId(cursos[i % cursos.length]),
  createdAt: new Date(),
  updatedAt: new Date(),
}))

module.exports = {
  async up(db, client) {
    await db.collection('alumnos').insertMany(alumnosPaginacion)
  },

  async down(db, client) {
    await db.collection('alumnos').deleteMany({
      _id: {
        $in: alumnosPaginacion.map((alumno) => alumno._id),
      },
    })
  },
}
