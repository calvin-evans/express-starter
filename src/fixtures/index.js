import * as fixtures from './*.js'

const connect = process.env.NODE_ENV === 'production'
  ? Promise.resolve()
  : Promise.all(Object.values(fixtures))

export default connect
