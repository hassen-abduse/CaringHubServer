const express = require('express')
const Evals = require('../models/eval_criteria')

const evalsRouter = express.Router()
evalsRouter.use(express.json())

evalsRouter.route('/')
  .get((req, res, next) => {
    Evals.find({})
      .then((skills) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(skills)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post((req, res, next) => {
    Evals.create(req.body)
      .then((skill) => {
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(skill)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    Evals.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
evalsRouter.route('/:evalId')
  .get((req, res, next) => {
    Evals.findById(req.params.evalId)
      .then((skill) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(skill)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .put((req, res, next) => {
    Evals.findByIdAndUpdate(req.params.evalId, { $set: req.body }, { new: true })
      .then((skill) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(skill)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete((req, res, next) => {
    Evals.findByIdAndRemove(req.params.evalId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = evalsRouter
