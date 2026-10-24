

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getOrderById, cancelOrder } = require('../controllers/orderController');

router.use(protect);

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.delete('/:id', cancelOrder);

module.exports = router;