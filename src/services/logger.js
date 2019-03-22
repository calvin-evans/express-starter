import winston from 'winston'
import Debug from 'debug'
/* eslint-disable */
require('winston-papertrail').Papertrail
/* eslint-enable */

export default function(program = '', level = 'info') {
  if (process.env.PAPERTRAIL_HOST && process.env.PAPERTRAIL_PORT) {
    const allowedLevels = ['debug', 'info', 'warn', 'error']
    if (!allowedLevels.includes(level)) {
      throw new Error(`Log level should be one of: \n${allowedLevels.join(',\n')}`)
    }

    const consoleLogger = new winston.transports.Console({
      level,
      timestamp() {
        return `server:${program}:`
      },
      colorize: true
    })

    const winstonPapertrail = new winston.transports.Papertrail({
      host: process.env.PAPERTRAIL_HOST,
      port: process.env.PAPERTRAIL_PORT,
      program: `server:${program}`,
      level,
      colorize: true
    })

    const transports = [winstonPapertrail]

    if (process.env.NODE_ENV !== 'production') {
      transports.push(consoleLogger)
    }

    const logger = new winston.Logger({
      transports })

    return function() {
      Array.prototype.forEach.call(arguments, arg => logger[level](arg))
    }
  } else {
    return new Debug(`server:${program}:${level}`)
  }
}
