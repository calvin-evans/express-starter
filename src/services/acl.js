import Acl from 'kiot-acl'
import logger from './logger'
import User from '../models/User'

const debug = logger('acl', 'debug')

export default async connection => {
  /* eslint-disable-next-line */
  const acl = new Acl(new Acl.mongodbBackend(connection.db, 'acl_'))
  acl.allow([
    {
      roles: ['user', 'admin'],
      allows: [
        { resources: ['/api/auth'], permissions: ['get'] }
      ]
    },
    {
      roles: ['admin'],
      allows: [
        { resources: ['/api/user', '/api/roles'], permissions: '*' }
      ]
    }
  ])
  // when not in prod assign roles based on 'role' prop on user docs
  if (process.env.NODE_ENV !== 'production') {
    try {
      const users = await User.find().exec()
      await Promise.all(users.map(user => {
        debug(`Assigning ${user.role} role to ${user.firstName} ${user.lastName} - ID: ${user._id.toString()}`)
        return acl.addUserRoles(user._id.toString(), user.role || 'user')
      }))
    } catch (err) {
      throw err
    }
  }

  return acl
}
