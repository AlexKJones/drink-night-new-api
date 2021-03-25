const mongoose = require('mongoose')

const partySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  bacpoints: {
    type: Number,
    required: false,
    min: 0
  },
  beer: {
    type: Number,
    required: false,
    min: 0
  },
  wine: {
    type: Number,
    required: false,
    min: 0
  },
  cider: {
    type: Number,
    required: false,
    min: 0
  },
  mead: {
    type: Number,
    required: false,
    min: 0
  },
  sake: {
    type: Number,
    required: false,
    min: 0
  },
  gin: {
    type: Number,
    required: false,
    min: 0
  },
  brandy: {
    type: Number,
    required: false,
    min: 0
  },
  whiskey: {
    type: Number,
    required: false,
    min: 0
  },
  rum: {
    type: Number,
    required: false,
    min: 0
  },
  tequila: {
    type: Number,
    required: false,
    min: 0
  },
  vodka: {
    type: Number,
    required: false,
    min: 0
  },
  absinthe: {
    type: Number,
    required: false,
    min: 0
  },
  everclear: {
    type: Number,
    required: false,
    min: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
}
)

module.exports = mongoose.model('Party', partySchema)
