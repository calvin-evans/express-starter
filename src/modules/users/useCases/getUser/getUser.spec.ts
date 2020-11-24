/* eslint-disable sort-keys-fix/sort-keys-fix */
import 'reflect-metadata'
import { describe } from 'riteway'
import User from '../../user.model'
import { getSelf } from './getUser.controller'
import { connect } from '../../../../shared/db'

describe('users/getUser/getSelf', async assert => {
  await connect()
  const user: any = await User.create({
    firstName: 'bob',
    lastName: 'bobson',
    email: 'bob@bobson.com',
    password: 'insecure',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  const res: any = await getSelf({ user: user.dataValues })
  assert({
    given: 'A User object',
    should: 'Return the user as a response',
    actual: { id: res.$value?.id, firstName: res.$value?.firstName },
    expected: { id: user.dataValues.id, firstName: 'bob' }
  })
})
