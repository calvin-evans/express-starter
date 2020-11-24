import Debug from 'debug'

export default (program = '', level = 'info') => {
  return Debug(`server:${program}:${level}`)
}
