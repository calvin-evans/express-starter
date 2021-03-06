import User from '../models/User'
import logger from '../services/logger'
import createError from 'http-errors'

const error = logger('controllers:user', 'error')

export const insertUser = async (req, res, next) => {
  const newUser = new User(req.body)
  try {
    const user = await newUser.save()
    delete user.password
    return res.json(user)
  } catch (error_) {
    error(error_)
    next(createError(400, error_.message))
  }
}
