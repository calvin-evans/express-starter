import {validateOrReject, ValidationError} from 'class-validator'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Context, GET, Path, POST, PreProcessor, Security, ServiceContext } from 'typescript-rest'
import { __, map, is, prop, omit, ifElse, both } from 'ramda'
import { Example, Response } from 'typescript-rest-swagger'
import { GeneralError, Result } from '../../core/Result'
import logger from '../../services/logger'
import User from './user.model'
import UserRepo, { GetUserError, InsertUserError } from './user.repo'
import {Task, chain, pipe, fold} from '@versita/fp-lib'

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
    const response = await UserRepo.getUserById(context.request.user.id)
        .fold(
          (_) => GetUserError.UserNotFoundError.of(context.request.user.email),
          (res) => Result.of({ success: true, value: res }),
        )
        .run()

    context.next(response)
  }

  @GET
  @Path('validateToken')
  @Security()
  validateToken () {
    return { valid: true }
  }

  @POST
  @Security()
  async insertUser(user: any, @Context context: ServiceContext) {
    const newUser = User.build(user)
    const response = await pipe(
      validateOrReject,
      Task.fromPromise,
      chain(() => Task.fromPromise(newUser.save())),
      fold(
       ifElse (
         both(is(Array), val => val[0] instanceof ValidationError),
         InsertUserError.InvalidUserData.of,
         GeneralError.of
       ),
       pipe(
         prop('dataValues'),
         omit(['password']),
         (value: Partial<User>) => ({
           success: true,
           value
         }),
         Result.of
       )
      )
    )(newUser).run()
    context.next(response)
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
