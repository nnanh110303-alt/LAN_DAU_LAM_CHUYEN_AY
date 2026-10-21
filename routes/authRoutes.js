// // File: routes/authRoutes.js
// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// // Khai báo các API endpoints
// router.post('/register', authController.register);
// router.post('/login', authController.login);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, invalidateAllTokens } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Chỉ user đã login mới được gọi
router.post('/invalidate-tokens', protect, invalidateAllTokens);

module.exports = router;