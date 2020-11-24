import express from 'express'
import { Result } from '../core/Result'

export interface IGenericDTO {
  id: string
  [key: string]: any
}

export type TMapperFn = (req?: express.Request, res?: express.Response) => any
export interface IMapper {
  [key: string]: TMapperFn
}

export interface IController<P, R> {
  (props: P): Promise<Result<R | Error>>
}

export interface IRouteDefinition {
  [key: string]: {
    method: 'GET' | 'DELETE' | 'PUT' | 'PATCH' | 'POST'
    path: string
    mapper: TMapperFn
    controller: IController<any, any>
    security?: string[]
    pre?: express.RequestHandler
    post?: express.RequestHandler
  }
}
