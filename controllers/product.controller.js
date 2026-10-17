const pool = require("../config/db");

// ==========================================
// 1. LẤY DANH SÁCH SẢN PHẨM CÒN HÀNG
// ==========================================
const getAllProducts = async (req, res) => {
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
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            "SELECT id, name, price, quantity FROM products WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
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
const createProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        if (!name || !price || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ name, price, quantity" });
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
// 4. MUA HÀNG AN TOÀN (TRANSACTION + FOR UPDATE)
// ==========================================
// Đổi tên thành checkoutProduct để khớp với router.post("/checkout", ...)
const checkoutProduct = async (req, res) => {
    const { user_id, items } = req.body;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "Thiếu user_id hoặc danh sách sản phẩm" });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            // Đã cập nhật FOR UPDATE để khóa dòng, chống Race Condition
            const [products] = await connection.query(
                'SELECT id, name, price, quantity FROM products WHERE id = ? FOR UPDATE',
                [item.product_id]
            );

            if (products.length === 0) {
                throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại`);
            }

            const product = products[0];

            if (product.quantity < item.quantity) {
                throw new Error(`Sản phẩm "${product.name}" không đủ hàng`);
            }

            const lineTotal = product.price * item.quantity;
            totalAmount += lineTotal;

            orderItemsData.push({
                product_id: product.id,
                quantity: item.quantity,
                price_at_purchase: product.price
            });
        }

        const orderCode = 'ORD' + Date.now();
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, order_id, total, subtotal) VALUES (?, ?, ?, ?)`,
            [user_id, orderCode, totalAmount, totalAmount]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItemsData) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price_at_purchase]
            );

            await connection.query(
                'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();
        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công",
            data: { order_id: orderId, order_code: orderCode, total_amount: totalAmount }
        });

    } catch (error) {
        await connection.rollback();
        console.error("Lỗi đặt hàng:", error.message);
        res.status(400).json({ success: false, message: error.message || "Đặt hàng thất bại" });
    } finally {
        connection.release();
    }
};

// ==========================================
// EXPORT ĐỒNG NHẤT TOÀN BỘ CÁC HÀM
// ==========================================
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    checkoutProduct
};