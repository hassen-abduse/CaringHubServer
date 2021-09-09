const multer = require('multer')
const multerGoogleStorage = require("multer-google-storage")
const { google } = require('googleapis')
const GoogleDriveStorage = require('multer-google-drive')
var drive = google.drive({version: "v3", auth: 'AIzaSyBWKnJWi0iAeBxzSL_Be7s_83ht5IXhReA'})
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

const upload = multer({
  storage: GoogleDriveStorage({
    drive: drive,
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
})


const uploadHandler = multer({
  storage: multerGoogleStorage.storageEngine({
    autoRetry: true,
    bucket: 'caring_hub',
    projectId: 'caringhub-325517',
    keyFilename: './caringhub-325517-81f38e135790',
    filename: (req, file, cb) => {
      cb(null, `/projectFiles/${file.originalname}`)
    }
  })
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => { // setting destination of uploading files        
    if (file.fieldname === "doc") { // if uploading resume
      cb(null, 'public/files');
    } else { // else uploading image
      cb(null, 'public/images');
    }
  },
  filename: (req, file, cb) => { // naming file
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "doc") { // if uploading resume
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) { // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else { // else uploading image
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) { // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};
const uploadMultiple = multer({ storage: fileStorage, fileFilter: fileFilter })
const imageUpload = multer({ storage: imageStorage, fileFilter: imageFileFilter })
const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFileFilter })

const express = require('express')
const auth = require('./auth')
const Volunteer = require('../models/volunteers')
const Organization = require('../models/organizations')
const Users = require('../models/users')
const Project = require('../models/projects')

const volImageUpload = express.Router()
const volResumeUpload = express.Router()
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
  .post(upload.single('test'), (req, res, next) => {
    const path = req.file.path
    res.send(path)
  })

volResumeUpload.route('/')
  .put(auth.verifyVol, pdfUpload.single('pdfUpload'), (req, res, next) => {
    const path = 'https://caringhub.herokuapp.com/' + req.file.path.replace(/\\/g, '/')
    Volunteer.findByIdAndUpdate(req.user._id, {
      $set: {
        resume: path
      }
    }, { new: true })
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
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
  userImageUpload,
  volResumeUpload,
  imageUpload,
  pdfUpload,
  uploadMultiple,
  uploadHandler
}
