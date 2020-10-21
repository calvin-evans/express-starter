import http from 'http'
import 'reflect-metadata'
import { init } from './app'
import './loadenv'
import logger from './services/logger'

const info = logger('server', 'info')
const error = logger('server', 'error')

init().then((app) => {
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
    const normalisedPort = parseInt(val, 10)

    if (isNaN(normalisedPort)) {
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
        error(`${bind} requires elevated privileges`)
        process.exit(1)
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'EADDRINUSE':
        error(`${bind} is already in use`)
        process.exit(1)
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
})
  .catch((err) => {
    throw err
  })
