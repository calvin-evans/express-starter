import passport from '../shared/passport'

export default {
  default: passport.authenticate('jwt', { session: false })
}
