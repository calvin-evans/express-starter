import devConfig from './environments/development'
import prodConfig from './environments/production'

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
