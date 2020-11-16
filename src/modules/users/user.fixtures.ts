import bcrypt from 'bcrypt'
import logger from '../../services/logger'
import User from './user.model'

const debug = logger('fixtures', 'debug')
const error = logger('fixtures', 'error')

export default async () => {
  try {
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
    const docs = await Promise.all(data.map(async (doc) => {
      const hashedPassword = await bcrypt.hash(doc.password, 10)
      doc.password = hashedPassword
      return doc
    }))
    await User.destroy({ where: {}, truncate: true })
    return User.bulkCreate(docs)
  } catch (err) {
    error(err)
  }
}
