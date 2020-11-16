import { Task } from '@versita/fp-lib'
import { QueryOptions } from 'sequelize/types'
import { IGenericDTO } from '../types/data'

export default interface IRepo<T> {
  exists (id: string): Task<never, boolean>
  remove (query: QueryOptions): Task<Error, number>
  save (data: IGenericDTO): Task<Error, T>
}
