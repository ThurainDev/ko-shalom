const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    required: true,
    enum: ['home', 'about', 'contact', 'product', 'global']
  },
  section: { 
    type: String, 
    required: true 
  },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  content: { type: String }, // For rich text content
  image: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  secondaryButtonText: { type: String },
  secondaryButtonLink: { type: String },
  items: [{ // For timeline items, events, etc.
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    date: { type: String },
    time: { type: String },
    venue: { type: String },
    buttonText: { type: String },
    link: { type: String },
    image: { type: String }
  }],
  socialLinks: [{ // For social media links
    platform: { type: String },
    url: { type: String },
    icon: { type: String }
  }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema); 