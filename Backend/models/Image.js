const mongoose = require('mongoose');

const borderSchema = new mongoose.Schema({
  id: Number,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  area: Number
});

const imageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  originalName: String,
  width: Number,
  height: Number,
  borders: [borderSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
