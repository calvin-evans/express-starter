import { identity, Task } from '@versita/fp-lib'
import { applySpec, pipe } from 'ramda'
import { QueryOptions } from 'sequelize/types'
import { Errors } from 'typescript-rest'
import IRepo from '../../core/Repo'
import { InvalidData, Result } from '../../core/Result'
import { IGenericDTO } from '../../types/core'
import { exists, findOne, remove, save } from '../../utils/ModelUtils'
import User from './user.model'

export namespace UserError {
  export class InvalidUserData extends InvalidData {}
  export class UserNotFound extends Result<Errors.BadRequestError> {
    static of (email: string) {
      return new UserNotFound({ error: new Errors.BadRequestError(`User with email addess: ${email} not found`), statusCode: 404, success: false })
    }
  }
}

export namespace AuthenticationError {
  export class LoginFailed extends Result<Error> {
    static of () {
      return new LoginFailed({ error: new Error('Authentication Failed'), statusCode: 401, success: false })
    }
  }
}

export interface IUserRepo extends IRepo<User> {
  createUser (user: Partial<User>): Promise<User>
  exists (userId: string): Task<never, boolean>
  getUserById (userId: string): Task<Error, User>
  save (data: IGenericDTO): Task<Error, User>
  remove (query: QueryOptions): Task<Error, number>
}

const UserRepo: IUserRepo = {
  createUser: (user) => User.create(user),
  exists: exists(User),
  getUserById: pipe(applySpec({ where: { id: identity } }), findOne(User)),
  remove: remove(User),
  save: save(User)
}

export default UserRepo
