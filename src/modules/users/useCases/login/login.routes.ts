import passport from '../../../../shared/passport'
import { IRouteDefinition } from '../../../../types/core'
import LoginMapper from './login.mapper'
import { handleLogin, validateToken } from './login.controller'
import { identity } from 'ramda'

const routes: IRouteDefinition = {
  Login: {
    controller: handleLogin,
    mapper: LoginMapper.login,
    method: 'POST',
    path: '/auth/login',
    pre: passport.authenticate('login')
  },
  ValidateToken: {
    controller: validateToken,
    mapper: identity,
    method: 'GET',
    path: '/user/validateToken',
    security: ['default']
  }
}

export default routes
