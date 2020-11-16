import bcrypt from 'bcrypt'
import { BeforeCreate, Column, CreatedAt, Default, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import logger from '../../services/logger'

const error = logger('models:user', 'error')

@Table
class User extends Model<User> {

  @BeforeCreate
  static async hashPassword (user: User) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      user.password = hashedPassword
    } catch (err) {
      error(err)
    }
  }

  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string

  @Column
  firstName: string

  @Column
  lastName: string

  @Column
  email: string

  @Column
  password: string

  @Column
  role: string

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}

export default User
