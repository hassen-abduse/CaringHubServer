const express = require('express')
const Organization = require('../models/organizations')
const organizationsRouter = express.Router()
const passport = require('passport')
organizationsRouter.use(express.json())

organizationsRouter.route('/')
  .get((req, res, next) => {
    Organization.find({})
      .then((orgs) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(orgs)
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
    Organization.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

organizationsRouter.route('/:orgId')
  .get((req, res, next) => {
    Organization.findById(req.params.orgId)
      .then((org) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(org)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post((req, res, next) => {
    res.statusCode = 403
    res.end('Error! Operation Not Supported!')
  })

  .put((req, res, next) => {
    // Update an org's Account
    Organization.findByIdAndUpdate(req.params.orgId, {
      $set: req.body
    }, { new: true })
      .then((org) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(org)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    // Delete an org's Account
    Organization.findByIdAndRemove(req.params.orgId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

organizationsRouter.post('/register', (req, res, next) => {
  // Register a new Organization
  Organization.register(new Organization({
    username: req.body.username,
    name: req.body.name,
    adminName: req.body.adminName,
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.emailAddress,
    adminPosition: req.body.adminPosition,
    address: req.body.address,
    mission: req.body.mission

  }),
  req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.json({ err: err })
    } else {
      passport.authenticate('org-local')(req, res, () => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({ success: true, status: 'Registration Successful!' })
      })
    }
  })
})

module.exports = organizationsRouter
