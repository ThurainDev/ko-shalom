const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trackSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  audio: { type: String },
});

const productSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['album', 'ep', 'single', 'live'], required: true },
  releaseDate: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  tracks: { type: [trackSchema], default: [] },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 