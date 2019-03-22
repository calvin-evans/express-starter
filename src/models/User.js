import bcrypt from 'bcrypt'
import logger from '../services/logger'
import Mongoose, { Schema, model } from 'mongoose'
import Joi from 'joi'
import Joigoose from 'joigoose'

const joigoose = Joigoose(Mongoose)

const error = logger('models:user', 'error')

const userSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(['interpreter', 'clinician', 'admin'])
})

const mongooseUserSchema = new Mongoose.Schema(joigoose.convert(userSchema))

mongooseUserSchema.pre('save', async function() {
  const user = this
  if (!user || !user.isModified('password')) return

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    user.password = hashedPassword
  } catch (err) {
    error(err)
  }
})

export default model('User', mongooseUserSchema)
