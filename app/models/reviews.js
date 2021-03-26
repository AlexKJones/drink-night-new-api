const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  notes: {
    type: String
  },
  blackout: {
    type: Boolean,
    required: false
  },
  heartburn: {
    type: Boolean,
    required: false
  },
  bloating: {
    type: Boolean,
    required: false
  },
  diarrhea: {
    type: Boolean,
    required: false
  },
  vomit: {
    type: Boolean,
    required: false
  },
  stomach: {
    type: Boolean,
    required: false
  },
  headache: {
    type: Boolean,
    required: false
  },
  breathing: {
    type: Boolean,
    required: false
  },
  coordination: {
    type: Boolean,
    required: false
  },
  insomnia: {
    type: Boolean,
    required: false
  },
  redface: {
    type: Boolean,
    required: false
  },
  memory: {
    type: Boolean,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Review', reviewSchema)
