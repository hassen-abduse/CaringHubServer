const express = require('express')
const Skills = require('../models/skills')

const skillsRouter = express.Router()
skillsRouter.use(express.json())

skillsRouter.route('/')
  .get((req, res, next) => {
    Skills.find({})
      .then((skills) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(skills)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post((req, res, next) => {
    Skills.create(req.body)
      .then((skill) => {
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(skill)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .put((req, res, next) => {
    res.statusCode = 403
    res.end('Error! Operation Not Supported!')
  })
  .delete((req, res, next) => {
    Skills.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
skillsRouter.route('/:skillId')
  .get((req, res, next) => {
    Skills.findById(req.params.skillId)
      .then((skill) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(skill)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post((req, res, next) => {
    res.statusCode = 403
    res.end('Error! Operation Not Supported!')
  })
  .put((req, res, next) => {
    Skills.findByIdAndUpdate(req.params.skillId, { $set: req.body }, { new: true })
      .then((skill) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(skill)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete((req, res, next) => {
    Skills.findByIdAndRemove(req.params.skillId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = skillsRouter
