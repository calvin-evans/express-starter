import Debug from 'debug'

export default (program = '', level = 'info') => {
  const logger = Debug(`server:${program}:${level}`)
  return logger
}
