const pool = require("../config/db");

// ==========================================
// 1. LẤY DANH SÁCH SẢN PHẨM CÒN HÀNG
// ==========================================
exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, name, price, quantity FROM products WHERE quantity > 0 ORDER BY id DESC"
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy sản phẩm" });
    }
};

// ==========================================
// 2. LẤY CHI TIẾT 1 SẢN PHẨM THEO ID
// ==========================================
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            "SELECT id, name, price, quantity FROM products WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// ==========================================
// 3. THÊM SẢN PHẨM MỚI
// ==========================================
exports.createProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        // Kiểm tra dữ liệu đầu vào cơ bản
        if (!name || !price || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ name, price, quantity"
            });
        }

        const [result] = await pool.query(
            "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)",
            [name, price, quantity]
        );

        res.status(201).json({
            success: true,
            message: "Thêm sản phẩm thành công",
            productId: result.insertId
        });
    } catch (error) {
        console.error("Lỗi thêm sản phẩm:", error);
        res.status(500).json({ success: false, message: "Thêm sản phẩm thất bại" });
    }
};

// ==========================================
// 4. MUA HÀNG AN TOÀN (TRANSACTION)
// ==========================================
exports.checkoutProduct = async (req, res) => {
    const { productId, quantity, customerName } = req.body;

    // Kiểm tra dữ liệu
    if (!productId || !quantity || !customerName) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin: productId, quantity, customerName"
        });
    }

    const connection = await pool.getConnection();

    try {
        // Bắt đầu Transaction
        await connection.beginTransaction();

        // Bước A: Trừ số lượng tồn kho (dùng quantity)
        const [updateResult] = await connection.query(
            "UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?",
            [quantity, productId, quantity]
        );

        // Nếu không trừ được (hết hàng hoặc không đủ)
        if (updateResult.affectedRows === 0) {
            throw new Error("Sản phẩm không tồn tại hoặc không đủ số lượng trong kho");
        }

        // Bước B: Tạo đơn hàng
        // Lưu ý: Em cần có bảng orders. Nếu chưa có thì tạo trước.
        await connection.query(
            `INSERT INTO orders (product_id, quantity, customer_name, created_at) 
             VALUES (?, ?, ?, NOW())`,
            [productId, quantity, customerName]
        );

        // Commit - Lưu vĩnh viễn
        await connection.commit();

        res.json({
            success: true,
            message: "Thanh toán thành công và đã trừ kho an toàn!"
        });

    } catch (error) {
        // Có lỗi → Rollback
        await connection.rollback();
        console.error("Lỗi thanh toán, đã rollback:", error.message);

        res.status(500).json({
            success: false,
            message: error.message || "Lỗi xử lý thanh toán"
        });
    } finally {
        // Trả kết nối về Pool
        connection.release();
    }
};