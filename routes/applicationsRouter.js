const express = require('express')
const Applications = require('../models/applications')
const applicationsRouter = express.Router()
applicationsRouter.use(express.json())

applicationsRouter.route('/')
  .get((req, res, next) => {
    Applications.find({})
      .populate('volunteer')
      .populate('project')
      .then((apps) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(apps)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post((req, res, next) => {
    Applications.create(req.body)
      .then((app) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(app)
      }, (err) => next(err))
      .catch((err) => next(err))
  })


  .delete((req, res, next) => {
    Applications.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

applicationsRouter.route('/:appId')
  .get((req, res, next) => {
    Applications.findById(req.params.appId)
      .then((app) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(app)
      }, (err) => next(err))
      .catch((err) => next(err))
  })


  .put((req, res, next) => {
    Applications.findByIdAndUpdate(req.params.appId, {
      $set: req.body
    }, { new: true })
      .then((app) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(app)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    Applications.findByIdAndRemove(req.params.appId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = applicationsRouter
