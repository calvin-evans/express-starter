import {join, pipe, map, prop, values, flatten} from 'ramda'
import {ValidationError} from 'sequelize/types'
import {Errors} from 'typescript-rest'

interface IResultSuccess<T> {
  success: true
  value: T
}

interface IResultError {
  success: false
  error: Errors.HttpError
}

export class Result<T> {

  static of (p: any): Result<any> {
    return new Result(p)
  }

  isSuccess: boolean
  isFailure: boolean
  error: T | Errors.HttpError
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
    }
    if ('value' in p) {
      this.value = p.value
    }

    Object.freeze(this)
  }

  get $value (): T {
    if (!this.isSuccess) {
      return this.error as T
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
      success: false,
      error: new Errors.UnprocessableEntityError(mapErrors(errors))
    })
  }
}

export class GeneralError extends Result<Error | any> {
  static of (error: Error | any) {
    return new GeneralError({
      success: false,
      error
    })
  }
}
