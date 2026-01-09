const Product=require('../models/Product')
const mongoose = require('mongoose');

// Helper to safely parse JSON strings
const parseJsonString = (str) => {
    try {
        if (str && typeof str === 'string') {
            return JSON.parse(str);
        }
    } catch (e) {
        console.error("Failed to parse JSON string:", str, e);
    }
    return [];
};

const ProductController = {
    /**
     * Fetch all products, sorted by creation date.
     */
    index: async (req, res) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 });
            return res.json(products);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to fetch products', details: err.message });
        }
    },

    /**
     * Create a new product.
     */
    create: async (req, res) => {
        try {
            const { body, file } = req;
            const productData = { ...body };

            if (file) {
                productData.image = file.filename;
            }

            if (productData.tracks) {
                productData.tracks = parseJsonString(productData.tracks);
            }

            const product = new Product(productData);
            await product.save();
            return res.status(201).json(product);
        } catch (err) {
            if (err.name === 'ValidationError') {
                return res.status(422).json({ error: 'Validation failed', details: err.errors });
            }
            return res.status(500).json({ error: 'Failed to create product', details: err.message });
        }
    },

    /**
     * Update an existing product.
     */
    update: async (req, res) => {
        try {
            const { body, files, params } = req;
            const updateData = { ...body };

            // Handle main image update
            if (files && files.image && files.image[0]) {
                updateData.image = files.image[0].filename;
            }

            // Parse tracks if they are a JSON string
            if (updateData.tracks) {
                updateData.tracks = parseJsonString(updateData.tracks);
            }

            // Associate uploaded audio files with their tracks
            if (updateData.tracks && Array.isArray(updateData.tracks)) {
                updateData.tracks.forEach((track, idx) => {
                    const audioFile = files && files[`trackAudio${idx}`];
                    if (audioFile && audioFile[0]) {
                        track.audio = audioFile[0].filename;
                    }
                });
            }

            const product = await Product.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(product);
        } catch (err) {
            if (err.name === 'ValidationError') {
                return res.status(422).json({ error: 'Validation failed', details: err.errors });
            }
            return res.status(500).json({ error: 'Failed to update product', details: err.message });
        }
    },

    /**
     * Delete a product.
     */
    delete: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json({ message: 'Product deleted successfully' });
        } catch (err) {
            return res.status(500).json({ error: 'Failed to delete product', details: err.message });
        }
    }
}

module.exports = ProductController;