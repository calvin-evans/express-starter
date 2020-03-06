import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cors from 'cors'
import config from './config'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import logger from './services/logger'
import passport from './services/passport'
import initAcl from './services/acl'
import * as fixtures from './fixtures/*.js'
import * as nestedApiRoutes from './routes/api/**/*.js'
import * as apiRoutes from './routes/api/*.js'
import createRoutes from './services/routes'

const info = logger('main', 'info')

async function init() {
  // connect to db
  mongoose.set('useCreateIndex', true)
  await mongoose.connect(config.orm.url, { useNewUrlParser: true })
  info('Database Connected')

  if (process.env.NODE_ENV !== 'production') {
    try {
      await Promise.all(Object.values(fixtures).map(load => load()))
      info('Fixtures loaded')
    } catch (err) {
      throw err
    }
  }

  const acl = await initAcl(mongoose.connection)
  info('ACL established')

  const app = express()
  // const info = logger('main', 'info')

  const getUserFromReq = req => req.user && req.user._id.toString()
  const apiRouter = createRoutes(Object.assign({}, apiRoutes, nestedApiRoutes), 'api', acl.middleware(2, getUserFromReq))

  app.use(morgan('dev'))
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.static(path.join(__dirname, 'admin')))
    .use(cors())
    .use(passport.initialize())
    .use('/api', apiRouter)

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404))
  })

  // error handler
  app.use((err, req, res, next) => {
    // render the error page
    if (err.status === 404) {
      if (req.originalUrl.includes('/api')) {
        res.sendStatus(404)
      } else {
        res.sendFile(path.join(__dirname, '/public/index.html'))
      }
    } else {
      res.status(err.status || 500).json({
        message: err.message
      })
    }
  })

  return app
}

const application = { init }

export default application
