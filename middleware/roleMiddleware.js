const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Phòng khi dev quên gắn protect phía trước
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
        }

        return next();
    };
};

module.exports = { authorizeRoles };