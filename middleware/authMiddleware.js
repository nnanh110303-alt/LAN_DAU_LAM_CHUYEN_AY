const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có token' });
    }

    const token = authHeader.split(' ')[1];

    // Bước 1: kiểm tra chữ ký + hạn dùng
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Bước 2: đối chiếu DB (user còn tồn tại? token_version còn khớp?)
    try {
        const [users] = await db.query(
            'SELECT id, email, role, token_version FROM users WHERE id = ?',
            [decoded.userId]
        );
        const user = users[0];

        if (!user || user.token_version !== decoded.tokenVersion) {
            return res.status(401).json({ message: 'Token đã bị vô hiệu hóa' });
        }

        req.user = user;
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi server' });
    }

    return next();
};

module.exports = { protect };