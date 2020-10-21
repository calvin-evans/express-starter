import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Context, Path, POST, PreProcessor, Security, ServiceContext } from 'typescript-rest'

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
