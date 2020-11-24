import { IMapper } from '../../../../types/core'

const mapper:IMapper = {
  login: (req) => ({
    user: req.user
  })
}

export default mapper
