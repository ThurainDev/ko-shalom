const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  section: { 
    type: String, 
    required: true, 
    enum: ['hero', 'musical-journey', 'musical-style', 'awards', 'philosophy']
  },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  content: { type: String }, // For rich text content
  image: { type: String },
  items: [{ // For timeline items, awards, etc.
    timeLine: { type: String },
    title: { type: String },
    description: { type: String },
    image: { type: String }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AboutContent', aboutContentSchema); 