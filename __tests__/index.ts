/* eslint-disable sort-keys-fix/sort-keys-fix */
import request from 'supertest'
import app from '../src/app'
import { describe } from 'riteway'
import { connect } from '../src/shared/db'
import loadDevFixtures from '../src/shared/devFixtures'

const setup = async () => {
  await connect()
  await loadDevFixtures()
}

const grabToken = async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'ceuk.dev@gmail.com', password: 'abcd1234' })
  return res.body.value.token
}

const assertAuthEnabled = async (url, assert) => {
  const res = await request(app).get(url)
  assert({
    given: 'No authentication',
    should: 'Respond with 401',
    actual: res.status,
    expected: 401
  })
}

describe('POST /auth/login', async assert => {
  await setup()
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'ceuk.dev@gmail.com', password: 'abcd1234' })
    .set('Accept', 'application/json')

  assert({
    given: 'Correct email & password',
    should: 'return id & token',
    actual: { id: !!res.body.value?.id, token: !!res.body.value?.token },
    expected: { id: true, token: true }
  })
})

describe('GET /user/me', async assert => {
  await setup()
  const token = await grabToken()
  await assertAuthEnabled('/user/me', assert)
  const res = await request(app)
    .get('/user/me')
    .set('Authorization', 'Bearer ' + token)
  assert({
    given: 'valid JWT',
    should: 'return current user from JWT',
    actual: !!res.body.value?.id,
    expected: true
  })
})

describe('GET /user/validateToken', async assert => {
  await setup()
  const token = await grabToken()
  await assertAuthEnabled('/user/validateToken', assert)
  const res = await request(app)
    .get('/user/validateToken')
    .set('Authorization', 'Bearer ' + token)
  assert({
    given: 'valid JWT',
    should: 'return return status 200',
    actual: res.status,
    expected: 200
  })
})
