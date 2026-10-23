const db = require('../config/db');

const getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, email, role FROM users WHERE id = ?',
            [req.user.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        return res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getProfile };