import { IsEmail, IsString } from 'class-validator'

export class LoginRequest {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class LoginResponse {
  @IsString()
  id: string

  @IsString()
  token: string
}
