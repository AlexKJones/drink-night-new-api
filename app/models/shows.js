const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  starring: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  released: {
    type: Date,
    required: true
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

module.exports = mongoose.model('Show', showSchema)
