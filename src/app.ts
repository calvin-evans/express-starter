import cors from 'cors'
import express from 'express'
import createError from 'http-errors'
import morgan from 'morgan'
import { PassportAuthenticator, Server } from 'typescript-rest'
import fixtures from './fixtures'
import initAcl from './services/acl'
import { connect } from './services/db'
import logger from './services/logger'
import passport, { deserializeUser, jwtStrat, serializeUser } from './services/passport'

const info = logger('main', 'info')
const httpLog = logger('http', 'debug')

const app = express()

app
  .use(morgan('combined', { stream: { write: (msg: string) => httpLog(msg) } }))
  .use('/api-docs/swagger', express.static('swagger'))
  .use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cors())
  .use(passport.initialize())

app.post('/auth/login', passport.authenticate('login'))

Server.registerAuthenticator(new PassportAuthenticator(jwtStrat, {
  deserializeUser,
  serializeUser
}))
Server.loadServices(app, 'controllers/*', __dirname)
Server.swagger(app, { filePath: './api-docs/swagger.json' })
Server.ignoreNextMiddlewares(true)

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404))
})

async function init () {
  // connect to db
  const connection = await connect()

  // load fixtures
  if (process.env.NODE_ENV !== 'production') {
    try {
      await Promise.all(fixtures.map((load) => load()))
      info('Fixtures loaded')
    } catch (err) {
      throw err
    }
  }

  const acl = await initAcl(connection)
  info('ACL established')

  const getUserFromReq = ({ user }: any) => user && user.id
  app.use(acl.middleware(2, getUserFromReq))

  return app
}

export { init, app }
