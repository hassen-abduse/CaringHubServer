const mongoose = require('mongoose')
const Schema = mongoose.Schema

const faqSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

const Faqs = mongoose.model('Faqs', skillSchema)
module.exports = Faqs
