import { identity, Task } from '@versita/fp-lib'
import { curry, ifElse, omit, pipe, } from 'ramda'
import { ModelCtor, QueryOptions } from 'sequelize/types'
import { IGenericDTO } from '../types/data'

/** findOne :: ModelCtor -> QueryOptions -> Task any Document */
export const findOne = curry((model: ModelCtor<any>, query: QueryOptions) =>
  new Task((reject, resolve) => model.findOne(query).then(ifElse(Boolean, resolve, reject)).catch(reject))
)

/** exists :: ModelCtor -> id -> Task Bool */
export const exists = (model: ModelCtor<any>) => ifElse(
      Boolean,
      (id) => new Task((_, resolve) => model.findOne({ where: { id } })
          .then(pipe(Boolean, resolve))
          .catch(() => resolve(false)))
      ,
      () => Task.of(null)
)

/** save :: ModelCtor -> IGenericDTO -> Task */
export const save = curry(<T extends IGenericDTO>(model: ModelCtor<any>, data: T) =>
    exists(model)(data?.id).chain(
      ifElse(
        identity,
        () => Task.fromPromise(model.update(omit(['id'], data), { where: { id: data.id } })),
        () => Task.fromPromise(model.create(data))
      )
    )
 )

 /** delete :: ModelCtor -> QueryOptions -> Task */
export const remove = curry((model: ModelCtor<any>, query: QueryOptions) =>
  Task.fromPromise(model.destroy(query))
)
