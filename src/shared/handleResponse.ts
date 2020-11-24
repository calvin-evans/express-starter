import express from 'express'
import { defaultTo, prop } from 'ramda'

const handleResponse: express.ErrorRequestHandler = (payload, _req, res, _next) => res
  .status(defaultTo(200, prop('statusCode')(payload)))
  .send(payload)

export default handleResponse
