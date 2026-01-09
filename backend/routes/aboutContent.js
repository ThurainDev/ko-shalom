const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

// Simple upload route for images
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    res.json({ filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all about content (public)
router.get('/', async (req, res) => {
  try {
    const content = await AboutContent.find({ isActive: true });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get content by section (public)
router.get('/section/:section', async (req, res) => {
  try {
    const content = await AboutContent.findOne({ 
      section: req.params.section, 
      isActive: true 
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes - require authentication
// Get all about content (admin)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const content = await AboutContent.find().sort({ section: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new about content
router.post('/admin', auth, upload.single('image'), async (req, res) => {
  try {
    const contentData = {
      ...req.body,
      image: req.file ? req.file.filename : undefined
    };

    // Handle items array if provided
    if (req.body.items) {
      contentData.items = JSON.parse(req.body.items);
    }

    const content = new AboutContent(contentData);
    const savedContent = await content.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update about content
router.put('/admin/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const contentData = { ...req.body };
    
    // If a new file is uploaded, use it; otherwise keep existing image
    if (req.file) {
      contentData.image = req.file.filename;
    } else if (req.body.image) {
      // Keep the existing image filename
      contentData.image = req.body.image;
    }

    const content = await AboutContent.findByIdAndUpdate(
      req.params.id,
      contentData,
      { new: true }
    );
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete about content
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const content = await AboutContent.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle content active status
router.patch('/admin/:id/toggle', auth, async (req, res) => {
  try {
    const content = await AboutContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    content.isActive = !content.isActive;
    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 