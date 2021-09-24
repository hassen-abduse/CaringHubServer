const express = require('express')
const auth = require('./auth')
const Applications = require('../models/applications')
const Organization = require('../models/organizations')
const Volunteer = require('../models/volunteers')

const approveOrg = express.Router()
const approveApp = express.Router()
const rateVolunteer = express.Router()

approveOrg.use(express.json())
approveApp.use(express.json())
rateVolunteer.use(express.json())

approveOrg.route('/')
	.put((req, res, next) => {
		Organization.findByIdAndUpdate(req.body.orgId, {
			$set: {
				isApproved: true
			}
		}, { new: true })
			.then((org) => {
				Organization.find({})
					.then((orgs) => {
						res.statusCode = 200
						res.setHeader('Content-Type', 'application/json')
						res.json(orgs)
					}
						, (err) => next(err))
					.catch((err) => next(err))
			}, (err) => next(err))
			.catch((err) => next(err))
	})

approveApp.route('/')
	.put((req, res, next) => {
		Applications.findByIdAndUpdate(req.body.appId, {
			$set: {
				accepted: true
			}
		}, { new: true })
			.then((app) => {
				Applications.find({})
					.then((apps) => {
						res.statusCode = 200
						res.setHeader('Content-Type', 'application/json')
						res.json(apps)
					}, (err) => next(err))
					.catch((err) => next(err))
			}, (err) => next(err))
			.catch((err) => next(err))
	})

rateVolunteer.route('/')
	.put((req, res, next) => {
		const rating = { project: req.body.projectId, value: req.body.rating }
		const conditions = { _id: req.body.volId, 'ratings.project': { $ne: req.body.projectId } }
		Volunteer.findOneAndUpdate(conditions, {
			$addToSet: {
				ratings: rating
			}
		}, { new: true })
			.then((response) => {
				if (!response) {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json({success: false, message: 'Already Evaluated!'})
				}
				else {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json({success: true, message: 'Success!'})
				}
			}, (err) => next(err))
			.catch((err) => next(err))
	})

module.exports = {
	approveApp,
	approveOrg,
	rateVolunteer
}