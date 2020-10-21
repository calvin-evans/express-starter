import UserModel from '../models/User'

declare global {
    namespace Express {
        export interface User extends UserModel {
          id?: string
          foo: string
        }
   }
}
