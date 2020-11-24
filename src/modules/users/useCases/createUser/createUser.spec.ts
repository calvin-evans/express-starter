/* eslint-disable sort-keys-fix/sort-keys-fix */
import 'reflect-metadata'
import { describe } from 'riteway'
import { createUser } from './createUser.controller'
import { connect } from '../../../../shared/db'

describe('users/createUser/createUser', async assert => {
  await connect()
  const user = {
    firstName: 'bob',
    lastName: 'bobson',
    email: 'bob@bobson.com',
    password: 'unsecure'
  }

  const success: any = await createUser({ user })
  assert({
    given: 'A valid user',
    should: 'Return the created user',
    actual: { id: !!success.$value?.id, firstName: success.$value?.firstName },
    expected: { id: true, firstName: 'bob' }
  })

  const failure: any = await createUser({ user: null })
  assert({
    given: 'An invalid user',
    should: 'Return a failed response',
    actual: failure.isFailure,
    expected: true
  })
})
