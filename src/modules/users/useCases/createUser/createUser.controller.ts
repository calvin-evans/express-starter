import { validateOrReject, ValidationError } from 'class-validator'
import { chain, fold, Task } from '@versita/fp-lib'
import { pipe, is, ifElse, both, prop, __, curry } from 'ramda'
import { SingleUserRequest, SingleUserResponse } from '../../user.dto'
import { IController } from '../../../../types/core'
import { GeneralError, Result } from '../../../../core/Result'
import User from '../../user.model'
import UserRepo, { UserError } from '../../user.repo'
import { plainToClass } from 'class-transformer'

export const createUser: IController<{user: SingleUserRequest}, SingleUserResponse> = async ({ user }) => {
  return pipe(
    validateOrReject,
    Task.fromPromise,
    chain(() => Task.fromPromise(UserRepo.createUser(user))),
    fold(
      ifElse(
        both(is(Array), val => val[0] instanceof ValidationError),
        UserError.InvalidUserData.of,
        GeneralError.of
      ),
      pipe(
        prop('dataValues'),
        curry(plainToClass)(SingleUserResponse, __, { excludeExtraneousValues: true }),
        (value: Partial<User>) => ({
          success: true,
          value
        }),
        Result.of
      )
    )
  )(user as any).run()
}
