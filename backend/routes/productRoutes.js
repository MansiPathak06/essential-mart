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

router.get('/products', getProducts);
router.get('/product-detail/:id', getProductById);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.post('/cart', addToCart);
router.get('/orders', getOrders);

module.exports = router;
