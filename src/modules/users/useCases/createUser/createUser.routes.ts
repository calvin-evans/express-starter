import { IRouteDefinition } from '../../../..//types/core'
import CreateUserMapper from './createUser.mapper'
import { createUser } from './createUser.controller'

const routes: IRouteDefinition = {
  CreateUser: {
    controller: createUser,
    mapper: CreateUserMapper.createUser,
    method: 'POST',
    path: '/user',
    security: ['default']
  }
}

export default routes
