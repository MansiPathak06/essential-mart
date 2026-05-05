const router = require('express').Router();
const { placeOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

router.post('/place', verifyToken, placeOrder);

module.exports = router;