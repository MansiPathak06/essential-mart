const router = require('express').Router();
const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    getOrders,
} = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/products', getProducts);
router.get('/product-detail/:id', getProductById);
router.post('/products', verifyAdmin, addProduct);
router.put('/products/:id', verifyAdmin, updateProduct);
router.delete('/products/:id', verifyAdmin, deleteProduct);

router.post('/cart', addToCart);
router.get('/orders', getOrders);

module.exports = router;
