import request from 'supertest'
import { app, init } from '../src/app'

jest.setTimeout(30000)

beforeEach(async () => {
  await init()
})

describe('/auth', () => {
  test('User can log in', async (done) => {
    await request(app)
      .post('/auth/login')
      .send({ email: 'ceuk.dev@gmail.com', password: 'abcd1234' })
      .set('Accept', 'application/json')
      .expect(200)
    done()
  })
})
