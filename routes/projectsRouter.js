const express = require('express')
const Projects = require('../models/projects')
const Applications = require('../models/applications')
const projectsRouter = express.Router()
const auth = require('./auth')
const { upload, getItem } = require('./cos')
projectsRouter.use(express.json())

projectsRouter.route('/')
  .get((req, res, next) => {
    Projects.find({})
      .populate('ownerOrg')
      .populate('skillSets')
      .populate('causeAreas')
      .then((projects) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(projects)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post(auth.verifyOrg, upload.single('projectImage'), async (req, res, next) => {
    var imagePath
    await getItem('caringhub', req.file.originalname).then((url) => {
      imagePath = url
    })
    Projects.create({
      ownerOrg: req.user._id,
      image: imagePath ? imagePath : '',
      location: JSON.parse(req.body.location),
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      skillSets: JSON.parse(req.body.skillSets),
      causeAreas: JSON.parse(req.body.causeAreas)
    })
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
      .populate('skillSets')
      .populate('causeAreas')
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
    Applications.findOneAndRemove({
      project: req.params.projectId
    }).then((resp) => {
      Projects.findByIdAndRemove(req.params.projectId)
        .then((resp) => {
          Projects.find({})
              .populate('ownerOrg')
              .populate('skillSets')
              .populate('causeAreas')
            .then((projects) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(projects)
            },
              (err) => next(err))
            .catch((err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err))
    }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = projectsRouter
