/* eslint-disable sort-keys-fix/sort-keys-fix */
import 'reflect-metadata'
import jwt from 'jsonwebtoken'
import { describe } from 'riteway'
import User from '../../user.model'
import { handleLogin, validateToken } from './login.controller'
import { connect } from '../../../../shared/db'

describe('users/login/handleLogin', async assert => {
  await connect()
  const user: any = await User.create({
    firstName: 'bob',
    lastName: 'bobson',
    email: 'bob@bobson.com',
    password: 'insecure',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const successfulLogin: any = await handleLogin({ user: user.dataValues })
  assert({
    given: 'A User object',
    should: 'Return the user ID and JWT token',
    actual: { id: successfulLogin.$value?.id, token: successfulLogin.$value?.token },
    expected: { id: user.dataValues.id, token: jwt.sign(user.dataValues, process.env.JWT_SECRET || 'NOT_SECURE') }
  })

  const failedLogin: any = await handleLogin({ user: null })
  assert({
    given: 'No User object',
    should: 'Return 401 response',
    actual: failedLogin.statusCode,
    expected: 401
  })
})

describe('users/login/validateToken', async assert => {
  const res: any = await validateToken(null)
  assert({
    given: 'Anything',
    should: 'Return a successful response',
    actual: res.$value.valid,
    expected: true
  })
})
