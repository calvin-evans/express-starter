import { identity, Task } from '@versita/fp-lib'
import { applySpec, pipe } from 'ramda'
import { QueryOptions } from 'sequelize/types'
import IRepo from '../../core/Repo'
import { Result } from '../../core/Result'
import { IGenericDTO } from '../../types/data'
import { exists, findOne, remove, save } from '../../utils/ModelUtils'
import User from './user.model'

export namespace GetUserError {
  export class UserNotFoundError extends Result<string> {
    static of (email: string) {
      return new UserNotFoundError({ success: false, error: `User with email addess: ${email} not found` })
    }
  }
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
