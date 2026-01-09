const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AdminController = require('../controllers/AdminController');
const ProductController = require('../controllers/ProductController');
const auth = require('../middleware/auth');
const ContactController = require('../controllers/ContactController');
const upload = require('../middleware/multer');

// Accept image and multiple audio files for tracks
const productUpload = upload.any();

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin registration (for Postman or initial setup)
router.post('/register', auth, AdminController.create);

// Product CRUD routes (admin only)
router.get('/products', auth, ProductController.index);
router.post('/products', auth, productUpload, ProductController.create);
router.put('/products/:id', auth, productUpload, ProductController.update);
router.delete('/products/:id', auth, ProductController.delete);

// Contact submissions (admin only)
router.get('/contacts', auth, ContactController.index);

// Site traffic (admin only)
router.get('/visits', auth, AdminController.getVisits);

module.exports = router; 