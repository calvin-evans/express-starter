/* global NodeJS */
import http from 'http'
import 'reflect-metadata'
import app from './app'
import loadDevFixtures from './shared/devFixtures'
import { connect } from './shared/db'
import './loadenv'
import logger from './shared/logger'

const info = logger('server', 'info')
const error = logger('server', 'error')

// connect to the db and load dev fixtures if applicable
connect().then(() => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
    loadDevFixtures()
  }
})

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || 3005)
app.set('port', port)

/**
* Create HTTP server.
*/
const server = http.createServer(app)

/**
* Listen on provided port, on all network interfaces.
*/
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort (val: any) {
  const normalisedPort = Number.parseInt(val, 10)

  if (Number.isNaN(normalisedPort)) {
    // named pipe
    return val
  }

  if (normalisedPort >= 0) {
    // port number
    return normalisedPort
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (err: NodeJS.ErrnoException) {
  if (err.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`)
      // tslint:disable-next-line:no-switch-case-fall-through
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`)
      // tslint:disable-next-line:no-switch-case-fall-through
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr ? addr.port : 'not set'}`
  info(`Listening on ${bind}`)
}

export default app
