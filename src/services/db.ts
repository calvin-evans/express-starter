import path from 'path'
import { Sequelize } from 'sequelize-typescript'
import logger from './logger'

const info = logger('database', 'info')
const debug = logger('database', 'debug')
const error = logger('database', 'error')

const dbURL = process.env.DB_URL || ''
const modelsPath = [path.join(__dirname, '../modules/*/*.model.ts')]

export const sequelize = new Sequelize(
  process.env.NODE_ENV === 'production' ? dbURL : 'sqlite::memory:',
  {
    logging: process.env.DEBUG_DB ? debug : false,
    models: modelsPath
  }
)

// export a function to allow connecting to the db (and testing the connection)
export const connect = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    info('Connection to database established')
    return sequelize
  } catch (err) {
    error('Unable to connect to database:', err)
    throw err
  }
}
