const Product=require('../models/Product')
const mongoose = require('mongoose');

const ProductController = {
    index : async (req, res)=>{
        // Fetch all products from the database
        try {
            const products = await Product.find();
            return res.json(products);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
    },
    // Add create method
    create: async (req, res) => {
        try {
            const data = req.body;
            // Handle file uploads (req.files is array from upload.any())
            if (req.files && req.files.length > 0) {
                const imageFile = req.files.find(f => f.fieldname === 'image');
                if (imageFile) {
                    data.image = imageFile.filename;
                }
            }

            if (typeof data.tracks === 'string') {
                try { data.tracks = JSON.parse(data.tracks); } catch (e) { data.tracks = []; }
            }

            // Handle audio files for tracks
            if (data.tracks && Array.isArray(data.tracks) && req.files) {
                data.tracks.forEach((track, idx) => {
                    const audioFile = req.files.find(f => f.fieldname === `trackAudio${idx}`);
                    if (audioFile) {
                        track.audio = audioFile.filename;
                    }
                });
            }

            const product = new Product(data);
            await product.save();
            return res.status(201).json(product);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    // Update product
    update: async (req, res) => {
        try {
            const data = req.body;
            
            // Handle image upload
            if (req.files && req.files.length > 0) {
                const imageFile = req.files.find(f => f.fieldname === 'image');
                if (imageFile) {
                    data.image = imageFile.filename;
                }
            }

            // Parse tracks if sent as string
            if (typeof data.tracks === 'string') {
                try { data.tracks = JSON.parse(data.tracks); } catch (e) { data.tracks = []; }
            }
            // Handle audio uploads for tracks
            if (data.tracks && Array.isArray(data.tracks) && req.files) {
                data.tracks.forEach((track, idx) => {
                    const audioFile = req.files.find(f => f.fieldname === `trackAudio${idx}`);
                    if (audioFile) {
                        track.audio = audioFile.filename;
                    }
                });
            }
            const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
            if (!product) return res.status(404).json({ error: 'Product not found' });
            return res.json(product);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    // Delete product
    delete: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            return res.json({ message: 'Product deleted' });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}

module.exports = ProductController;