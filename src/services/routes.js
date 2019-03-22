import express from 'express'
import path from 'path'
import passport from 'passport'
import logger from './logger'

const info = logger('routes', 'info')
const error = logger('routes', 'error')

function createRoutes(routes, prefix, aclMiddleware) {
  const router = express.Router()
  try {
    for (const key in routes) {
      if (routes[key]) {
        const filePath = key.split('$')
        const fileName = filePath[filePath.length - 1]
        const fileIsMethod = ['get', 'put', 'post', 'delete'].includes(fileName)
        if (fileIsMethod && filePath.length > 1) {
          filePath.pop()
        }
        const setRoute = route => {
          const fallbackMethod = fileIsMethod ? fileName : 'get'
          const fallbackPath = `/${path.join(...filePath)}`

          const method = route.method || fallbackMethod
          const routePath = route.path || fallbackPath
          let callbacks = route.middleware || []
          if (!route.public) {
            callbacks.push(passport.authenticate('jwt', { session: false }), aclMiddleware)
          }
          callbacks = callbacks.concat(route.controller)

          router[method](routePath, callbacks)
          info(`Creating API endpoint: ${method.toUpperCase()} /${prefix}${routePath}`)
        }
        routes[key].forEach(setRoute)
      }
    }
  } catch (err) {
    throw err
  }
  return router
}

export default createRoutes
