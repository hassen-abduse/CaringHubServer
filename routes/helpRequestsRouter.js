const express = require('express')
const HelpRequests = require('../models/helpRequests')
const requestsRouter = express.Router()
requestsRouter.use(express.json())

requestsRouter.route('/')
  .get((req, res, next) => {
    HelpRequests.find({})
      .populate('user')
      .then((requests) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(requests)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post((req, res, next) => {
    HelpRequests.create(req.body)
      .then((request) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(request)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    HelpRequests.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

requestsRouter.route('/:requestId')
  .get((req, res, next) => {
    HelpRequests.findById(req.params.requestId)
      .then((request) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(request)
      }, (err) => next(err))
      .catch((err) => next(err))
  })


  .put((req, res, next) => {
    HelpRequests.findByIdAndUpdate(req.params.requestId, {
      $set: req.body
    }, { new: true })
      .then((request) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(request)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    HelpRequests.findByIdAndRemove(req.params.requestId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = requestsRouter
