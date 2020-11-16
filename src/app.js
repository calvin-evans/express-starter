import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import logger from './services/logger'
import passport from './services/passport'
import * as nestedApiRoutes from './routes/api/**/*.js'
import * as apiRoutes from './routes/api/*.js'
import createRoutes from './services/routes'

const error = logger('http', 'error')

const app = express()
const apiRouter = createRoutes(Object.assign({}, apiRoutes, nestedApiRoutes))

app.use(morgan('dev'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(cors())
  .use(passport.initialize())
  .use(apiRouter)
  .use((err, _, __, next) => {
    // Log the error
    error(err)
    next(err)
  })

export default app
