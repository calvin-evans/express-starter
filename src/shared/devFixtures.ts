import { devFixtures as users } from '../modules/users/user.fixtures'

export default () => Promise.all([
  users()
])
