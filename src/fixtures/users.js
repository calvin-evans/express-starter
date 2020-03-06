import logger from '../services/logger'
import User from '../models/User'
import bcrypt from 'bcrypt'

const debug = logger('fixtures', 'debug')

export default async() => {
  debug('loading User fixtures')
  const data = [
    {
      firstName: 'Betty',
      lastName: 'TheAdmin',
      email: 'ceuk.dev@gmail.com',
      password: 'abcd1234',
      role: 'admin'
    }
  ]
  const docs = await Promise.all(data.map(async doc => {
    const hashedPassword = await bcrypt.hash(doc.password, 10)
    doc.password = hashedPassword
    return new User(doc)
  }))
  await User.deleteMany({})
  return User.insertMany(docs)
}
