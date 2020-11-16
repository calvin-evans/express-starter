import express from 'express'
import passport from 'passport'
import logger from './logger'
import { forEachObjIndexed, prop, when, pipe, propOr, applySpec, ifElse, flip, toLower, replace, append, concat, forEach } from 'ramda'

const info = logger('routes', 'info')

// functions
const authenticatedMiddleware = [passport.authenticate('jwt', { session: false })]
const getMethod = pipe(
  propOr('get', 'method'),
  toLower
)
const path = filePath => propOr(concat('/', replace('$', '/', filePath)), 'path')
const buildMiddleware = ifElse(
  prop('public'),
  prop('controller'),
  pipe(
    prop('controller'),
    ifElse(
      Array.isArray,
      concat(authenticatedMiddleware),
      flip(append)(authenticatedMiddleware)
    )
  )
)
// end fns

export default routes => {
  const router = express.Router()

  // functional steps
  forEachObjIndexed((definitions, filePath) =>
    forEach(
      when(prop('controller'),
        pipe(
          // normalize the route definition
          applySpec({
            handler: buildMiddleware,
            method: getMethod,
            path: path(filePath),
            public: propOr(false, 'public')
          }),
          // add it to the router
          ({ handler, method, path }) => {
            router[method](path, handler)
            info(`Creating API endpoint: ${method.toUpperCase()} ${path}`)
          }
        )
      )
      , definitions)
  , routes)

  return router
}
