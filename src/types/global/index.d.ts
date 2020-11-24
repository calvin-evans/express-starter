import UserModel from '../../modules/users/user.model'

declare global {
    // eslint-disable-next-line no-unused-vars
    namespace Express {
        export interface User extends UserModel {
          id?: string
        }
   }
   interface Assertion<T> {
     readonly given: any;
     readonly should: string;
     readonly actual: T;
     readonly expected: T;
   }
   export function assert<T>(assertion: Assertion<T>): void;
}
