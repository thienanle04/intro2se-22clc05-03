const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  isHidden: {
    type: Boolean,
    default: false
  },
}, { timestamps: true })

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;