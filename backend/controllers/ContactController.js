const Contact = require('../models/Contact');

const ContactController = {
  // Create a new contact submission
  create: async (req, res) => {
    try {
      const { name, email, subject, message, type } = req.body;
      const contact = new Contact({ name, email, subject, message, type });
      await contact.save();
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  // Get all contact submissions (admin only)
  index: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ date: -1 });
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ContactController; 