import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import createError from 'http-errors'
import morgan from 'morgan'
import requireGlob from 'require-glob'
import passport from './shared/passport'
import logger from './shared/logger'
import handleResponse from './shared/handleResponse'
import swaggerUI from 'swagger-ui-express'
import swaggerJSON from '../api-docs/swagger.json'
import createRouter from './shared/createRouter'
import { append } from 'ramda'

const routeDefinitions = requireGlob.sync('./modules/**/*.routes*', {
  reducer: (_opts: any, list: any, file: any) => append(file, list || [])
}).map(({ exports }) => exports.default)

const router = createRouter(routeDefinitions)

const httpLog = logger('http', 'debug')

const app = express()

app
  .use(morgan('combined', { stream: { write: (msg: string) => httpLog(msg) } }))
  .use(helmet())
  .use(express.json())
  .use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))
  .use(express.urlencoded({ extended: false }))
  .use(cors())
  .use(passport.initialize())
  .use(router)
  .use(handleResponse)
  .use((_req, _res, next) => {
    next(createError(404))
  })

export default app
