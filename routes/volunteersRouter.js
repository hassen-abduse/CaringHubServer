const express = require('express')
const Volunteer = require('../models/volunteers')
const volunteersRouter = express.Router()
const passport = require('passport')

volunteersRouter.use(express.json())

volunteersRouter.route('/')
  .get((req, res, next) => {
    Volunteer.find({})
      .then((vols) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vols)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post((req, res, next) => {
    res.statusCode = 403
    res.end('Error! Operation Not Supported!')
  })

  .put((req, res, next) => {
    res.statusCode = 403
    res.end('Error! Operation Not Supported!')
  })

  .delete((req, res, next) => {
    Volunteer.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

volunteersRouter.route('/:volId')
  .get((req, res, next) => {
    Volunteer.findById(req.params.volId)
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post((req, res, next) => {
    res.statusCode = 403
    res.end('Error! Operation Not Supported!')
  })

  .put((req, res, next) => {
    // Update a Volunteer's Account
    Volunteer.findByIdAndUpdate(req.params.volId, {
      $set: req.body
    }, { new: true })
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    // delete a Volunteer's account
    Volunteer.findByIdAndRemove(req.params.volId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

volunteersRouter.post('/register', (req, res, next) => {
  // Register a new Volunteer
  Volunteer.register(new Volunteer({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.emailAddress,
    address: req.body.address,
    skillSets: req.body.skillSets,
    causeAreas: req.body.causeAreas

  }),
  req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.json({ err: err })
    } else {
      passport.authenticate('vol-local')(req, res, () => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({ success: true, status: 'Registration Successful!' })
      })
    }
  })
})
module.exports = volunteersRouter
