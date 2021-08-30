const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/users')
const Volunteer = require('../models/volunteers')
const Organization = require('../models/organizations')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const config = require('../config')

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey,
    { expiresIn: 3600 })
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

passport.use('user-jwt', new JwtStrategy(opts, (jwtPayload, done) => {
  console.log('jwt-payload: ', jwtPayload)
  User.findOne({ _id: jwtPayload._id }, (err, user) => {
    if (err) {
      return done(err, false)
    } else if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
}))

passport.use('org-jwt', new JwtStrategy(opts, (jwtPayload, done) => {
  console.log('jwt-payload: ', jwtPayload)
  Organization.findOne({ _id: jwtPayload._id }, (err, user) => {
    if (err) {
      return done(err, false)
    } else if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
}))

passport.use('vol-jwt', new JwtStrategy(opts, (jwtPayload, done) => {
  console.log('jwt-payload: ', jwtPayload)
  Volunteer.findOne({ _id: jwtPayload._id }, (err, user) => {
    if (err) {
      return done(err, false)
    } else if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
}))
passport.use('user-local', new LocalStrategy(User.authenticate()))

passport.use('org-local', new LocalStrategy(Organization.authenticate()))

passport.use('vol-local', new LocalStrategy(Volunteer.authenticate()))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((login, done) => {
  if (login.role === 'User') {
    User.deserializeUser()
  } else if (login.role === 'Admin') {
    User.deserializeUser()
  } else if (login.role === 'Org') {
    Organization.deserializeUser()
  } else if (login.role === 'Vol') {
    Volunteer.deserializeUser()
  } else {
    done({ message: 'No Entity Found!' }, null)
  }
})

exports.verifyUser = passport.authenticate('user-jwt', { session: false })

exports.verifyOrg = passport.authenticate('org-jwt', { session: false })

exports.verifyVol = passport.authenticate('vol-jwt', { session: false })

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role === 'Admin') {
    next()
  } else {
    const err = new Error('Unauthorized!')
    err.status = 401
    next(err)
  }
}

exports.verifyIsOrgApproved = (req, res, next) => {
  if (req.user.isApproved === true) {
    next()
  } else {
    const err = new Error('Unauthorized!')
    err.status = 401
    next(err)
  }
}
