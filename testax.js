const express = require('express');
const app = express();
const PORT = 3000;

// Middleware giúp Express đọc được dữ liệu JSON gửi từ Client
app.use(express.json());

// 1. Trang chủ
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Chào mừng bạn đến với API Hệ thống Bán hàng trực tuyến!"
    });
});

// 2. Lấy danh sách sản phẩm
app.get('/products', (req, res) => {
    res.json({
        success: true,
        count: 2,
        data: [
            { id: 1, name: "Laptop Dell XPS 13", price: 25000000, stock: 10 },
            { id: 2, name: "Bàn phím cơ Keychron K2", price: 1800000, stock: 25 }
        ]
    });
});

// 3. Lấy danh sách người dùng (User/Khách hàng)
app.get('/users', (req, res) => {
    res.json({
        success: true,
        count: 2,
        data: [
            { id: 101, username: "nguyenvana", email: "a@gmail.com", role: "customer" },
            { id: 102, username: "tranvanb", email: "b@gmail.com", role: "admin" }
        ]
    });
});

// 4. Lấy danh sách đơn hàng
app.get('/orders', (req, res) => {
    res.json({
        success: true,
        count: 1,
        data: [
            { id: "ORD-9981", userId: 101, totalAmount: 25000000, status: "pending" }
        ]
    });
});

// 5. Trang thông tin cửa hàng
app.get('/about', (req, res) => {
    res.json({
        success: true,
        storeName: "TechShop Vietnam",
        version: "1.0.0",
        contact: "support@techshop.vn"
    });
});

// Minh họa thêm POST / PUT / DELETE để em hình dung trọn vẹn vòng đời CRUD:

// Thêm mới 1 sản phẩm
app.post('/products', (req, res) => {
    res.status(201).json({
        success: true,
        message: "Đã thêm sản phẩm mới thành công!",
        data: req.body
    });
});

// Cập nhật sản phẩm
app.put('/products', (req, res) => {
    res.json({
        success: true,
        message: "Cập nhật thông tin sản phẩm thành công!"
    });
});

// Xóa sản phẩm
app.delete('/products', (req, res) => {
    res.json({
        success: true,
        message: "Đã xóa sản phẩm khỏi hệ thống!"
    });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});