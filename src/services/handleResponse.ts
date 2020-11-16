import express from 'express'
import { defaultTo, ifElse, path, propSatisfies } from 'ramda'
import { Result } from '../core/Result'

const getStatusCode = ifElse(propSatisfies(Boolean, 'success'), () => 200, path(['error', 'statusCode']))

export default (payload: Result<any>, _: express.Request, res: express.Response, __: express.NextFunction) => res
    .status(defaultTo(500, getStatusCode(payload)))
    .send(payload)
