const express = require('express')
const router = express.Router();
const ProductController = require('../controllers/ProductController')
const auth = require('../middleware/auth');

router.get('/products', ProductController.index);
// POST route removed - only admin can create products
// router.post('', auth, ProductController.create);
// router.put('/:id', auth, ProductController.update);
// router.delete('/:id', auth, ProductController.delete);

module.exports = router;