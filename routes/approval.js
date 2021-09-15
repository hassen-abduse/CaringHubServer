const express = require('express')
const auth = require('./auth')
const Applications = require('../models/applications')
const Organization = require('../models/organizations')

const approveOrg = express.Router()
const approveApp = express.Router()

approveOrg.use(express.json())
approveApp.use(express.json())

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
                    })
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
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(app)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

module.exports = {
    approveApp,
    approveOrg
}