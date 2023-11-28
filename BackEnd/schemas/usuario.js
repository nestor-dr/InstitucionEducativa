const mongoose = require('mongoose')
const validate = require('mongoose-validator')
const bcrypt = require('bcrypt')

const { Schema } = mongoose
const { ObjectId } = Schema.Types
const emailValidator = validate({ validator: 'isEmail' })

const usuarioSchema = new Schema({  
  nombre:   { type: String, required: true, lowercase: true, trim: true},
  apellido: { type: String, required: true, lowercase: true, trim: true},
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true, validate: emailValidator},
  password: { type: String, required: true, select: false},
  rol:      { type: ObjectId, ref: 'Roles', required: true}
})

usuarioSchema.method('checkPassword', async function checkPassword(potentialPassword) {
  if (!potentialPassword) {
    return Promise.reject(new Error('Password is required'))
  }

  const isMatch = await bcrypt.compare(potentialPassword, this.password)
  return { isOk: isMatch}
})

const Usuario = mongoose.model('Usuario', usuarioSchema)

module.exports = Usuario