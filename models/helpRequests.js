const mongoose = require('mongoose')
const Schema = mongoose.Schema

const helpRequestSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  applicationDate: {
    type: Date,
    default: Date.now()
  },
  location: {
    type: Map,
    required: true
  }
}, {
  timestamps: true
})

const HelpRequests = mongoose.model('HelpRequest', helpRequestSchema)
module.exports = HelpRequests
