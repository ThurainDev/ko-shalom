const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

// Get all content (public)
router.get('/', async (req, res) => {
  try {
    const content = await Content.find({ isActive: true }).sort({ order: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get content by page (public)
router.get('/page/:page', async (req, res) => {
  try {
    const content = await Content.find({ 
      page: req.params.page, 
      isActive: true 
    }).sort({ order: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get content by section (public)
router.get('/section/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ 
      section: req.params.section, 
      isActive: true 
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes - require authentication
// Get all content (admin)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const content = await Content.find().sort({ page: 1, order: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new content
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

    // Handle social links if provided
    if (req.body.socialLinks) {
      contentData.socialLinks = JSON.parse(req.body.socialLinks);
    }

    const content = new Content(contentData);
    const savedContent = await content.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update content
router.put('/admin/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const contentData = { ...req.body };

    // Ensure image updates even when only a filename is provided
    if (req.file) {
      contentData.image = req.file.filename;
    } else if (req.body.image) {
      contentData.image = req.body.image;
    // No fallback field; expect 'image' when filename provided without new file
    }

    // Handle items array if provided
    if (req.body.items) {
      contentData.items = JSON.parse(req.body.items);
    }

    // Handle social links if provided
    if (req.body.socialLinks) {
      contentData.socialLinks = JSON.parse(req.body.socialLinks);
    }

    const content = await Content.findByIdAndUpdate(
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

// Delete content
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
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
    const content = await Content.findById(req.params.id);
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