/* global Express */
import jwt from 'jsonwebtoken'
import { IController } from '../../../../types/core'
import { Result } from '../../../../core/Result'
import { AuthenticationError } from '../../user.repo'
import { LoginResponse } from './login.dto'

export const handleLogin: IController<{user: Express.User}, LoginResponse> = async ({ user }) => {
  return user
    ? Result.of({
      success: true,
      value: {
        id: user.id,
        token: jwt.sign(user, process.env.JWT_SECRET || 'NOT_SECURE')
      }
    })
    : AuthenticationError.LoginFailed.of()
}

export const validateToken: IController<null, {valid: true}> = async () => Result.of({ success: true, value: { valid: true } })
