import { identity, Task } from '@versita/fp-lib'
import { applySpec, pipe } from 'ramda'
import { QueryOptions, ValidationError } from 'sequelize/types'
import { Errors } from 'typescript-rest'
import IRepo from '../../core/Repo'
import { InvalidData, Result } from '../../core/Result'
import { IGenericDTO } from '../../types/data'
import { exists, findOne, remove, save } from '../../utils/ModelUtils'
import User from './user.model'

export namespace GetUserError {
  export class UserNotFoundError extends Result<Errors.BadRequestError> {
    static of (email: string) {
      return new UserNotFoundError({ success: false, error: new Errors.BadRequestError(`User with email addess: ${email} not found`) })
    }
  }
}
export namespace InsertUserError {
  export class InvalidUserData extends InvalidData {}
}

export interface IUserRepo extends IRepo<User> {
  getUserById (userId: string): Task<Error, User>
  exists (userId: string): Task<never, boolean>
  save (data: IGenericDTO): Task<Error, User>
  remove (query: QueryOptions): Task<Error, number>

}

const UserRepo: IUserRepo = {
  getUserById: pipe(applySpec({ where: { id: identity } }), findOne(User)),
  exists: exists(User),
  save: save(User),
  remove: remove(User)
}

export default UserRepo
