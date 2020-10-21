import createError from 'http-errors'
import { Context, GET, Path, POST, Security, ServiceContext } from 'typescript-rest'
import { Example, Response } from 'typescript-rest-swagger'
import User from '../models/User'
import logger from '../services/logger'

const error = logger('controllers:user', 'error')

const exampleUser: Partial<User> = {
  id: '123456-123456-123456-123456',
  firstName: 'Frank',
  lastName: 'Sinatra',
  email: 'frank@sinatra.com',
  createdAt: new Date('2020-10-21T09:01:20.040Z'),
  updatedAt: new Date('2020-10-21T09:01:20.040Z')
}

@Path('/user')
export class UserController {

  @GET
  @Path('me')
  @Security()
  @Response(200, 'The user object')
  @Response(401, 'Error. Unauthorized')
  @Example(exampleUser)
  getSelf (@Context context: ServiceContext): Express.User | null {
    return context.request.user || null
  }

  @GET
  @Path('validateToken')
  @Security()
  validateToken () {
    return { valid: true }
  }

  @POST
  @Security()
  async insertUser (user: any): Promise<boolean | createError.HttpError> {
    try {
      await User.create(user)
      return true
    } catch (err) {
      error(err)

      throw createError(400, err.message)
    }
  }
}
