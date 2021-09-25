const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EvalSchema = new Schema({
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

const Evals = mongoose.model('Skill', EvalSchema)
module.exports = Evals
