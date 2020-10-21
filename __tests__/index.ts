import request from 'supertest'
import { app, init } from '../src/app'

jest.setTimeout(30000)

beforeEach(async () => {
  await init()
})

let token

const grabToken = (done) => {
  request(app)
      .post('/auth/login')
      .send({ email: 'ceuk.dev@gmail.com', password: 'abcd1234' })
      .end((err, res) => {
        if (err) return done(err)
        token = res.body.token
        return done()
      })
}

const checkAuthWorks = (url, done) => {
  request(app)
      .get(url)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err)
      })
}

describe('/auth', () => {

  test('POST /auth/login', (done) => {
    request(app)
      .post('/auth/login')
      .send({ email: 'ceuk.dev@gmail.com', password: 'abcd1234' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('token')
        return done()
      })
  })
})

describe('/user', () => {
  beforeEach(grabToken)
  test('GET /user/me', (done) => {
    checkAuthWorks('/user/me', done)
    request(app)
      .get('/user/me')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('firstName')
        expect(res.body).toHaveProperty('lastName')
        expect(res.body).toHaveProperty('email')
        expect(res.body).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('updatedAt')
        return done()
      })
  })

  test('GET /user/validateToken', async (done) => {
    checkAuthWorks('/user/validateToken', done)
    await request(app)
      .get('/user/validateToken')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    done()
  })
})
