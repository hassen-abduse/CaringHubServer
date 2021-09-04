const express = require('express')
const Projects = require('../models/projects')
const projectsRouter = express.Router()
projectsRouter.use(express.json())

projectsRouter.route('/')
  .get((req, res, next) => {
    Projects.find({})
      .populate('ownerOrg')
      .then((projects) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(projects)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post((req, res, next) => {
    Projects.create(req.body)
      .then((project) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(project)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    Projects.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

projectsRouter.route('/:projectId')
  .get((req, res, next) => {
    Projects.findById(req.params.projectId)
      .populate('ownerOrg')
      .then((project) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(project)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .put((req, res, next) => {
    Projects.findByIdAndUpdate(req.params.projectId, {
      $set: req.body
    }, { new: true })
      .then((project) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(project)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    Projects.findByIdAndRemove(req.params.projectId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = projectsRouter
