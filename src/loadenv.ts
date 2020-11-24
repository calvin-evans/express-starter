import logger from './shared/logger'
import env from 'node-env-file'
const info = logger('config', 'info')

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production')
}

try {
  env(`${__dirname}/../.env`)
} catch {
  info('no .env file found')
}
