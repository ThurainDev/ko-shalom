const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', visitSchema); 