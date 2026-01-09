const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

// General image upload route
router.post('/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image file provided' });
  // Multer-storage-cloudinary provides path/url in req.file.path
  res.json({
    filename: req.file.filename, // Cloudinary public_id
    url: req.file.path,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// Multiple images upload route
router.post('/images', auth, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No image files provided' });
  const uploadedFiles = req.files.map(file => ({
    filename: file.filename, // Cloudinary public_id
    url: file.path,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype
  }));
  res.json({ files: uploadedFiles });
});

// List all uploaded files - Not fully supported with Cloudinary via filesystem
// We would need to use Cloudinary Admin API to list resources
router.get('/files', auth, async (req, res) => {
  try {
    // This requires Cloudinary Admin API which might not be configured
    // For now, return empty or implement if needed
    // const cloudinary = require('cloudinary').v2;
    // const result = await cloudinary.api.resources({ type: 'upload', prefix: 'shalom-app/' });
    // res.json(result.resources);
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete uploaded file
router.delete('/:filename', auth, async (req, res) => {
  try {
    const cloudinary = require('cloudinary').v2;
    // Filename in Cloudinary storage usually includes folder e.g. 'shalom-app/filename'
    // If req.params.filename is just the ID, we might need to prepend folder
    // But multer-storage-cloudinary usually sets filename as 'folder/name'
    
    // Note: We need to handle resource_type (image/video/raw)
    // Try to delete as image first, then raw/video if needed
    
    const publicId = req.params.filename;
    
    await cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) throw error;
      res.json({ message: 'File deleted successfully', result });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;