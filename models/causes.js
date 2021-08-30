const mongoose = require('mongoose')
const Schema = mongoose.Schema

const causeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Causes = mongoose.model('Cause', causeSchema)
module.exports = Causes
