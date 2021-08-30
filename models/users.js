const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'User'
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true
  },
  emailAddress: {
    type: String,
    unique: true,
    required: true
  },
  address: {
    type: Map,
    required: true
  }

}, {
  timestamps: true
})
User.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', User)
