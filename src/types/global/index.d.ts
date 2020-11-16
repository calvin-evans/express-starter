import UserModel from '../../modules/users/user.model'

declare global {
    namespace Express {
        export interface User extends UserModel {
          id?: string
          foo: string
        }
   }
}
