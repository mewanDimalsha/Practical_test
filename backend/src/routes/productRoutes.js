const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct   
} = require('../controllers/productController');

router.use(verifyToken);
// Define the routes with token verification middleware
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;    