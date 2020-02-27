import bcrypt from 'bcrypt'
import logger from '../services/logger'
import Mongoose, { Schema, model } from 'mongoose'

const error = logger('models:user', 'error')

const schema = new Mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true})

schema.pre('save', async function() {
  const user = this
  if (!user || !user.isModified('password')) return

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    user.password = hashedPassword
  } catch (err) {
    error(err)
  }
})

export default model('User', schema)

