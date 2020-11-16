import { Left, Right } from '@versita/fp-lib/either'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Context, GET, Path, POST, PreProcessor, Security, ServiceContext } from 'typescript-rest'
import { Example, Response } from 'typescript-rest-swagger'
import { Result } from '../../core/Result'
import logger from '../../services/logger'
import User from './user.model'
import UserRepo, { GetUserError } from './user.repo'

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
  async getSelf (@Context context: ServiceContext) {
    try {
      const response = await UserRepo.getUserById(context.request.user.id)
        .fold(
          (_) => GetUserError.UserNotFoundError.of(context.request.user.email),
          (res) => Result.of({ success: true, value: res }),
        )
        .run()
      return response.value
    } catch (err) {
      return err
    }
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

// tslint:disable-next-line:max-classes-per-file
@Path('/auth')
export class AuthController {

  @Path('login')
  @POST
  loginSuccessful (@Context context: ServiceContext) {
    const user = context.request.user
    if (user) {
      return {
        id: user.id,
        token: jwt.sign(user, process.env.JWT_SECRET || 'NOT_SECURE')
      }
    }
    throw createError(400, 'Something went wrong')
  }

  @Path('register')
  @POST
  @Security()
  @PreProcessor(passport.authenticate('register'))
  registrationSuccessful (@Context context: ServiceContext) {
    return context.request.user
  }
}
