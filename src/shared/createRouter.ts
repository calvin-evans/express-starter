/* eslint-disable security/detect-object-injection */
import express from 'express'
import logger from './logger'
import securityMethods from './security'
import { IController, IRouteDefinition, TMapperFn } from '../types/core'
import { forEachObjIndexed, forEach, prepend, append, concat, pipe, when } from 'ramda'

const info = logger('routes', 'info')

// withMapper :: TMapperFn -> IController -> RequestHandler
const withMapper = (mapper: TMapperFn) => (controller: IController<any, any>) => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const props = mapper(req, res)
  const result = await controller(props)
  next(result)
}

export default (routes: IRouteDefinition[]) => {
  const router = express.Router()

  forEach((file) =>
    forEachObjIndexed(({ method, path, mapper, controller, security = [], pre, post }) => {
      if (!method || !path || !controller) return
      const securityMiddleware = security.map(def => securityMethods[def])
      const handler = pipe(
        withMapper(mapper),
        Array.of,
        when(() => !!pre, prepend(pre)),
        when(() => !!post, append(post)),
        concat(securityMiddleware)
      )(controller)
      router[method.toLowerCase()](path, handler)
      info(`Creating API endpoint: ${method.toUpperCase()} ${path}`)
    }
    , file)
  , routes)

  return router
}
