import { Expose } from 'class-transformer'
import { IsEmail, IsString, IsDate } from 'class-validator'

export class SingleUserRequest {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class SingleUserResponse {
  @Expose()
  @IsString()
  id: string

  @Expose()
  @IsString()
  firstName: string

  @Expose()
  @IsString()
  lastName: string

  @Expose()
  @IsDate()
  createdAt: Date

  @Expose()
  @IsDate()
  updatedAt: Date

  @Expose()
  @IsEmail()
  email: string
}
