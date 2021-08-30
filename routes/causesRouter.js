const express = require('express')
const Causes = require('../models/causes')
const causesRouter = express.Router()

causesRouter.use(express.json())

causesRouter.route('/')
  .get((req, res, next) => {
    Causes.find({})
      .then((causes) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(causes)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post((req, res, next) => {
    Causes.create(req.body)
      .then((cause) => {
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(cause)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .put((req, res, next) => {
    res.statusCode = 403
    res.end('Error! Operation Not Supported!')
  })
  .delete((req, res, next) => {
    Causes.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
causesRouter.route('/:causeId')
  .get((req, res, next) => {
    Causes.findById(req.params.causeId)
      .then((cause) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(cause)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post((req, res, next) => {
    res.statusCode = 403
    res.end('Error! Operation Not Supported!')
  })
  .put((req, res, next) => {
    Causes.findByIdAndUpdate(req.params.causeId, { $set: req.body }, { new: true })
      .then((cause) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(cause)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete((req, res, next) => {
    Causes.findByIdAndRemove(req.params.causeId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = causesRouter
