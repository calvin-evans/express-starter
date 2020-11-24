/* eslint-disable immutable/no-this */
import { join, pipe, map, prop, values, flatten } from 'ramda'
import { ValidationError } from 'sequelize/types'
import { Errors } from 'typescript-rest'

interface IResultSuccess<T> {
  success: true
  value: T,
  statusCode?: number
}

interface IResultError {
  success: false
  error: Error,
  statusCode?: number
}

export class Result<T> {
  static of (p: any): Result<any> {
    return new Result(p)
  }

  isSuccess: boolean
  isFailure: boolean
  statusCode: number
  error: Error
  private value: T

  constructor (p: IResultSuccess<T> | IResultError) {
    if (p.success && 'error' in p) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error')
    }
    if (!p.success && !('error' in p)) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message')
    }

    this.isSuccess = p.success
    this.isFailure = !p.success
    if ('error' in p) {
      this.error = { ...p.error, message: p.error.message }
      this.statusCode = p.statusCode || 500
    }
    if ('value' in p) {
      this.value = p.value
      this.statusCode = p.statusCode || 200
    }

    Object.freeze(this)
  }

  get $value (): T | Error {
    if (!this.isSuccess) {
      return this.error
    }

    return this.value
  }
}

// other genreal errors
export class InvalidData extends Result<Errors.UnprocessableEntityError> {
  static of (errors: ValidationError[]) {
    const mapErrors = pipe(
      map(pipe(
        prop('constraints') as any,
        values
      )),
      flatten,
      join(', ')
    )
    return new InvalidData({
      error: new Errors.UnprocessableEntityError(mapErrors(errors)),
      statusCode: 400,
      success: false
    })
  }
}

export class GeneralError extends Result<Error | any> {
  static of (error: Error | any) {
    return new GeneralError({
      error,
      success: false
    })
  }
}
