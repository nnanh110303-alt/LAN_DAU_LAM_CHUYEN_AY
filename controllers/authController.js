const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Kết nối MySQL thuần của bạn
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// ====================== REGISTER ======================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: result.insertId,
        name,
        email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ====================== LOGIN ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Lưu Refresh Token vào database (7 ngày)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    await db.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiresAt]
    );

    // Gửi Refresh Token bằng HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    res.json({
      message: 'Đăng nhập thành công',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ====================== REFRESH TOKEN ======================
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Không có refresh token' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_key');

    // Kiểm tra token có tồn tại trong DB không
    const [storedTokens] = await db.query(
      "SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ?", 
      [refreshToken, decoded.userId]
    );

    if (storedTokens.length === 0 || new Date(storedTokens[0].expires_at) < new Date()) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }

    // Lấy user mới nhất
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.userId]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    const user = users[0];
    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Refresh token không hợp lệ' });
  }
};

// ====================== LOGOUT ======================
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Xóa refresh token khỏi DB
      await db.query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
    }

    // Xóa cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ====================== VÔ HIỆU HÓA TOKEN (Admin / Bị hack) ======================
exports.invalidateAllTokens = async (req, res) => {
  try {
    // Tăng token_version lên 1
    await db.query("UPDATE users SET token_version = token_version + 1 WHERE id = ?", [req.user.id]);

    // Xóa tất cả Refresh Token của user này
    await db.query("DELETE FROM refresh_tokens WHERE user_id = ?", [req.user.id]);

    res.clearCookie('refreshToken');
    res.json({ message: 'Tất cả token đã bị vô hiệu hóa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};