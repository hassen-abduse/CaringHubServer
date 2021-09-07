const multer = require('multer')

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files')
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const imageFileFilter = (req, file, cb) => {
  if ((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const pdfFileFilter = (req, file, cb) => {
  if ((file.mimetype).includes('pdf')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const imageUpload = multer({ storage: imageStorage, fileFilter: imageFileFilter })
const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFileFilter })

const express = require('express')
const auth = require('./auth')
const Volunteer = require('../models/volunteers')
const Organization = require('../models/organizations')
const Users = require('../models/users')
const Project = require('../models/projects')

const volImageUpload = express.Router()
const userImageUpload = express.Router()
const orgLogoUpload = express.Router()
const projectImageUpload = express.Router()

volImageUpload.use(express.json())
userImageUpload.use(express.json())
orgLogoUpload.use(express.json())
projectImageUpload.use(express.json())

volImageUpload.route('/')
  .put(auth.verifyVol, imageUpload.single('imageUpload'), (req, res, next) => {
    const path = 'https://caringhub.herokuapp.com/' + req.file.path.replace(/\\/g, '/')
    Volunteer.findByIdAndUpdate(req.user._id, {
      $set: {
        profilePicture: path
      }
    }, { new: true })
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
volResumeUpload()
userImageUpload.route('/')
  .put(auth.verifyUser, imageUpload.single('imageUpload'), (req, res, next) => {
    const path = 'https://caringhub.herokuapp.com/' + req.file.path.replace(/\\/g, '/')
    Users.findByIdAndUpdate(req.user._id, {
      $set: {
        profilePicture: path
      }
    }, { new: true })
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

orgLogoUpload.route('/')
  .put(auth.verifyOrg, imageUpload.single('imageUpload'), (req, res, next) => {
    const path = 'https://caringhub.herokuapp.com/' + req.file.path.replace(/\\/g, '/')
    Organization.findByIdAndUpdate(req.user._id, {
      $set: {
        logo: path
      }
    }, { new: true })
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
projectImageUpload.route('/:projectId')
  .put(imageUpload.single('imageUpload'), (req, res, next) => {
    const path = 'https://caringhub.herokuapp.com/' + req.file.path.replace(/\\/g, '/')
    Project.findByIdAndUpdate(req.params.projectId, {
      $set: {
        image: path
      }
    }, { new: true })
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = {
  volImageUpload,
  orgLogoUpload,
  projectImageUpload,
  userImageUpload
}
