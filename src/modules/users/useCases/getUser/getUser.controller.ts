import { SingleUserResponse } from '../../user.dto'
import { IController } from '../../../../types/core'
import { Result } from '../../../../core/Result'

export const getSelf: IController<{user: Express.User}, SingleUserResponse> = async ({ user }) => {
  return Result.of({ success: true, value: user })
}
