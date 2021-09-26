const express = require('express')
const Faqs = require('../models/faqs')

const faqsRouter = express.Router()
faqsRouter.use(express.json())

faqsRouter.route('/')
  .get((req, res, next) => {
    Faqs.find({})
      .then((faqs) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(faqs)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post((req, res, next) => {
    Faqs.create(req.body)
      .then((faq) => {
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(faq)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    Faqs.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
faqsRouter.route('/:faqId')
  .get((req, res, next) => {
    Faqs.findById(req.params.faqId)
      .then((faq) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(faq)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .put((req, res, next) => {
    Faqs.findByIdAndUpdate(req.params.faqId, { $set: req.body }, { new: true })
      .then((faq) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(faq)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete((req, res, next) => {
    Faqs.findByIdAndRemove(req.params.faqId)
      .then((resp) => {
        Faqs.find({})
          .then((faqs) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(faqs)
          }, (err) => next(err))
          .catch((err) => next(err))
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = faqsRouter
