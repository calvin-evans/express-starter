import Acl from 'acl'
import AclSeq from 'acl-sequelize'
import { Sequelize } from 'sequelize-typescript'
import User from '../modules/users/user.model'
import logger from './logger'

const debug = logger('acl', 'debug')

export default async (connection: Sequelize) => {
  /* eslint-disable-next-line */
  const acl = new Acl(new AclSeq(connection, { prefix: 'acl_' }))
  acl.allow([
    {
      allows: [
        { permissions: ['*'], resources: ['/auth'] }
      ],
      roles: ['user', 'admin']
    },
    {
      allows: [
        { permissions: '*', resources: ['/user', '/roles'] }
      ],
      roles: ['admin']
    }
  ])
  // when not in prod assign roles based on 'role' prop on user docs
  if (process.env.NODE_ENV !== 'production') {
    try {
      const users = await User.findAll({ raw: true })
      await Promise.all(users.map((user) => {
        debug(`Assigning ${user.role} role to ${user.firstName} ${user.lastName} - ID: ${user.id}`)
        return acl.addUserRoles(user.id, user.role || 'user')
      }))
    } catch (error) {
      throw error
    }
  }

  return acl
}
