const express = require('express')
const Volunteer = require('../models/volunteers')
const volunteersRouter = express.Router()
const passport = require('passport')
const { upload, getPreSignedUrl } = require('./cos')

volunteersRouter.use(express.json())

volunteersRouter.route('/')
  .get((req, res, next) => {
    Volunteer.find({})
      .populate('skillSets')
      .populate('causeAreas')
      .then((vols) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vols)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    Volunteer.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

volunteersRouter.route('/:volId')
  .get((req, res, next) => {
    Volunteer.findById(req.params.volId)
      .populate('skillSets')
      .populate('causeAreas')
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })


  .put((req, res, next) => {
    // Update a Volunteer's Account
    Volunteer.findByIdAndUpdate(req.params.volId, {
      $set: req.body
    }, { new: true })
      .then((vol) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(vol)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    // delete a Volunteer's account
    Volunteer.findByIdAndRemove(req.params.volId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

volunteersRouter.post('/register', upload.fields([{ name: 'VolPP' }, { name: 'doc' }]), (req, res, next) => {
  var imagePath = '', resumePath = ''
  getPreSignedUrl('caringhub', req.files.VolPP[0].originalname).then((value) => {
    imagePath = value
  })
  getPreSignedUrl('caringhub', req.files.doc[0].originalname).then((value) => {
    resumePath = value
  })
  console.log(imagePath)
  console.log(resumePath)
  Volunteer.register(new Volunteer({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profilePicture: imagePath ? imagePath : '',
    resume: resumePath ? resumePath : '',
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.emailAddress,
    address: JSON.parse(req.body.address),
    skillSets: req.body.skillSets,
    causeAreas: req.body.causeAreas

  }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.json({ error: err, })
      } else {

        passport.authenticate('vol-local')(req, res, () => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json({ success: true, status: 'Registration Successful!' })
        })
      }
    })
})


module.exports = volunteersRouter
