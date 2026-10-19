// File: controllers/authController.js
const bcrypt = require('bcrypt');
// TODO: Em require phần kết nối Database ở đây (ví dụ mysql hoặc mô hình db của em)

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Băm mật khẩu với 10 vòng lặp
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // TODO: Viết câu lệnh SQL INSERT vào bảng users với giá trị (username, hashedPassword)
        // Sau khi chạy xong, em có thể mở MySQL Workbench để xem chuỗi mã hóa lưu trong bảng.

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // TODO: Viết lệnh SQL SELECT user từ database theo username
        // Giả sử truy vấn trả về đối tượng user có thuộc tính user.password (là chuỗi hash trong DB)
        
        // Đoạn code giả lập user lấy từ DB (em hãy thay bằng code SQL thật nhé):
        const user = { username: username, password: "chuỗi_hash_lấy_từ_database" }; 

        // Nếu không tìm thấy user, báo lỗi
        if (!user) {
            return res.status(401).json({ message: "Sai tên đăng nhập!" });
        }

        // So sánh mật khẩu gửi lên với chuỗi hash trong DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.status(200).json({ message: "Đăng nhập thành công! (Chuẩn bị trả về JWT)" });
        } else {
            res.status(401).json({ message: "Sai mật khẩu!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

module.exports = { register, login };