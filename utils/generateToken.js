const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    const secret = process.env.JWT_SECRET || 'super_secret_key_123456';
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
            tokenVersion: user.token_version
        },
        secret,
        { expiresIn: '15m' }
    );
};

const generateRefreshToken = (user) => {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
    return jwt.sign(
        { userId: user.id },
        refreshSecret,
        { expiresIn: '7d' }
    );
};

module.exports = { generateAccessToken, generateRefreshToken };