import { IRouteDefinition } from '../../../..//types/core'
import GetUserMapper from './getUser.mapper'
import { getSelf } from './getUser.controller'

const routes: IRouteDefinition = {
  GetSelf: {
    controller: getSelf,
    mapper: GetUserMapper.getSelf,
    method: 'GET',
    path: '/user/me',
    security: ['default']
  }
}

export default routes
