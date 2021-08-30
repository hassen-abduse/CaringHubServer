const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  ownerOrg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  location: {
    type: Map,
    required: true
  },
  skillSets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],

  causeAreas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cause' }]

}, {
  timestamps: true
})

const Projects = mongoose.model('Project', projectSchema)
module.exports = Projects
