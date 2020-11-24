import bcrypt from 'bcrypt'
import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrat } from 'passport-jwt'
import { Strategy as LocalStrat } from 'passport-local'
import { omit } from 'ramda'
import User from '../modules/users/user.model'
import logger from './logger'

const debug = logger('passport', 'debug')
const error = logger('passport', 'error')

export const serializeUser = async (user: any, done?: (err: any, user: any) => string | Promise<string>) => {
  if (!done) return omit(['password'], user.dataValues)
  done(null, omit(['password'], user.dataValues))
}

export const deserializeUser = async (user: any, done?: (err: any, user: any) => any) => {
  try {
    if (!done) return omit(['password', 'role'], user)
    done(null, omit(['password', 'role'], user))
  } catch (error_) {
    error(error_)
    if (!done) return error_
    done(error_, null)
  }
}

passport.serializeUser(serializeUser)

passport.deserializeUser(deserializeUser)

passport.use('register', new LocalStrat(
  {
    passwordField: 'password',
    session: false,
    usernameField: 'email'
  },
  async (email, password, done) => {
    try {
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser !== null) {
        debug('Registration failed: Email already registered')
        return done(null, false, { message: 'Email is already registered, please log in' })
      }
      const newUser = await User.create({ email, password })
      debug('New user registered')
      return done(null, newUser)
    } catch (error_) {
      error(error_)
    }
  }
))

passport.use('login', new LocalStrat(
  {
    passwordField: 'password',
    session: false,
    usernameField: 'email'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ raw: true, where: { email } })
      if (!user) {
        debug('Authentication failed: Invalid Email')
        return done(null, false, { message: 'No user exists with that email' })
      }
      const passwordValid = await bcrypt.compare(`${password}`, user.password)
      if (!passwordValid) {
        debug('Authentication failed: Incorrect Password')
        return done(null, false, { message: 'Incorrect password' })
      }
      debug('User authenticated')
      return done(null, user)
    } catch (error_) {
      error(error_)
    }
  }
))

passport.use('jwt', new JwtStrat(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'NOT_SECURE'
  },
  async (jwtPayload, done) => {
    try {
      const user = await User.findByPk(jwtPayload.id, { raw: true })
      if (!user) {
        debug('JWT User ID did not match known user')
        return done(null, false)
      }
      debug('JWT valid ✔')
      done(null, omit(['password'], user))
    } catch (error_) {
      error(error_)
    }
  }
))

export default passport
