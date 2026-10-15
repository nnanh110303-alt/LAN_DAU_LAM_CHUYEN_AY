// File: config/db.js
const mysql = require("mysql2/promise");
require('dotenv').config(); // Load biến môi trường từ file .env hiện có của em

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "", // Sửa lại đúng pass của em trong .env
    database: process.env.DB_NAME || "shop_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hàm kiểm tra kết nối
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Kết nối MySQL thành công tuyệt đối!');
        connection.release(); // Trả kết nối lại cho pool sau khi dùng xong
    } catch (error) {
        console.error('❌ Kết nối MySQL thất bại:', error.message);
    }
}

// Chạy thử hàm kiểm tra
testConnection();

// Xuất pool ra để các file khác trong dự án web bán hàng có thể dùng để truy vấn Data
module.exports = pool;