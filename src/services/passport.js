import passport from 'passport'
import { Strategy as LocalStrat } from 'passport-local'
import { Strategy as JwtStrat, ExtractJwt } from 'passport-jwt'
import User from '../models/User'
import bcrypt from 'bcrypt'
import logger from './logger'

const debug = logger('passport', 'debug')
const error = logger('passport', 'error')

passport.serializeUser(async(user, done) => {
  done(null, user)
})

passport.deserializeUser(async(id, done) => {
  try {
    const user = await User.findById(id).exec()
    done(null, user)
  } catch (err) {
    error(err)
    done(err, null)
  }
})

passport.use('register', new LocalStrat(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  async(email, password, done) => {
    try {
      const existingUser = await User.findOne({ email }).lean().exec()
      if (existingUser !== null) {
        debug('Registration failed: Email already registered')
        return done(null, false, { message: 'Email is already registered, please log in' })
      }
      const newUser = new User({ email, password })
      await newUser.save()
      debug(`New user registered`)
      return done(null, user)
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
  async(email, password, done) => {
    try {
      const user = await User.findOne({ email }).lean().exec()
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

passport.use('jwt', new JwtStrat(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'NOT_SECURE'
  },
  async(jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload._id)
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
))

export default passport
