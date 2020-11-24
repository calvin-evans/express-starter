import { IMapper } from '../../../../types/core'

const mapper:IMapper = {
  createUser: (req) => ({
    user: req.body
  })
}

export default mapper
