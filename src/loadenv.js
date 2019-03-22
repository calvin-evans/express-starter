import logger from './services/logger'
import env from 'node-env-file'
const info = logger('config', 'info')

try {
  env(`${__dirname}/../.env`)
} catch (err) {
  info('no .env file found')
}
