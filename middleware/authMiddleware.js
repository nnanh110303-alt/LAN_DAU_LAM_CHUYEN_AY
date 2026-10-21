const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Sử dụng cấu hình db của dự án

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Thêm giá trị fallback cho JWT_SECRET
            const secret = process.env.JWT_SECRET || 'super_secret_key_123456';
            const decoded = jwt.verify(token, secret);

            // Tìm user bằng db.query thay vì User.findByPk
            const [users] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.userId]);
            const user = users[0];

            if (!user || user.token_version !== decoded.tokenVersion) {
                return res.status(401).json({ message: 'Token đã bị vô hiệu hóa' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        }
    } else {
        return res.status(401).json({ message: 'Không có token' });
    }
};

module.exports = { protect };