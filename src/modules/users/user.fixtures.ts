import bcrypt from 'bcrypt'
import logger from '../../shared/logger'
import User from './user.model'

const debug = logger('fixtures', 'debug')
const error = logger('fixtures', 'error')

export const devFixtures = async () => {
  try {
    debug('loading User fixtures')
    const data = [
      {
        email: 'ceuk.dev@gmail.com',
        firstName: 'Betty',
        lastName: 'TheAdmin',
        password: 'abcd1234',
        role: 'admin'
      }
    ]
    const docs = await Promise.all(data.map(async (doc) => {
      const hashedPassword = await bcrypt.hash(doc.password, 10)
      doc.password = hashedPassword
      return doc
    }))
    await User.destroy({ truncate: true, where: {} })
    return User.bulkCreate(docs)
  } catch (error_) {
    error(error_)
  }
}
