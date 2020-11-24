import { IMapper } from '../../../../types/core'

const mapper:IMapper = {
  getSelf: (req) => ({
    user: req.user
  })
}

export default mapper
