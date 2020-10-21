import bcrypt from 'bcrypt'
import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrat } from 'passport-jwt'
import { Strategy as LocalStrat } from 'passport-local'
import User from '../models/User'
import logger from './logger'

const debug = logger('passport', 'debug')
const error = logger('passport', 'error')

export const serializeUser = async (user: any, done?: (err: any, user: any) => string | Promise<string>) => {
  if (!done) return user
  done(null, user)
}

export const deserializeUser = async (user: any, done?: (err: any, user: any) => any) => {
  try {
    delete user.passsword
    if (!done) return user.dataValues
    done(null, user.dataValues)
  } catch (err) {
    error(err)
    if (!done) return err
    done(err, null)
  }
}

passport.serializeUser(serializeUser)

passport.deserializeUser(deserializeUser)

passport.use('register', new LocalStrat(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  async (email, password, done) => {
    try {
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser !== null) {
        debug('Registration failed: Email already registered')
        return done(null, false, { message: 'Email is already registered, please log in' })
      }
      const newUser = await User.create({ email, password })
      debug(`New user registered`)
      return done(null, newUser)
    } catch (err) {
      error(err)
    }
  }
))

passport.use('login', new LocalStrat(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        debug('Authentication failed: Invalid Email')
        return done(null, false, { message: 'No user exists with that email' })
      }
      const passwordValid = await bcrypt.compare(`${password}`, user.password)
      if (!passwordValid) {
        debug('Authentication failed: Incorrect Password')
        return done(null, false, { message: 'Incorrect password' })
      }
      debug(`User authenticated`)
      return done(null, user)
    } catch (err) {
      error(err)
    }
  }
))

const jwtStrat = new JwtStrat(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'NOT_SECURE'
  },
  async (jwtPayload, done) => {
    try {
      const user = await User.findByPk(jwtPayload.id)
      if (!user) {
        debug('JWT User ID did not match known user')
        return done(null, false)
      }
      debug('JWT valid ✔')
      done(null, user)
    } catch (err) {
      error(err)
    }
  }
)

export { jwtStrat }

export default passport
