const pool = require('../config/db');

// POST /api/orders
const createOrder = async (req, res) => {
    // user lấy từ TOKEN (do protect gắn), KHÔNG lấy từ body
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Thiếu danh sách sản phẩm"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const qty = Number(item.quantity);
            if (!item.product_id || !Number.isInteger(qty) || qty <= 0) {
                const e = new Error("Sản phẩm hoặc số lượng không hợp lệ");
                e.status = 400;
                throw e;
            }

            const [products] = await connection.query(
                'SELECT id, name, price, quantity FROM products WHERE id = ? FOR UPDATE',
                [item.product_id]
            );

            if (products.length === 0) {
                const e = new Error(`Sản phẩm ID ${item.product_id} không tồn tại`);
                e.status = 400;
                throw e;
            }

            const product = products[0];

            if (product.quantity < qty) {
                const e = new Error(`Sản phẩm "${product.name}" không đủ hàng (chỉ còn ${product.quantity})`);
                e.status = 400;
                throw e;
            }

            totalAmount += Number(product.price) * qty;
            orderItemsData.push({
                product_id: product.id,
                quantity: qty,
                price_at_purchase: product.price
            });
        }

        const orderCode = 'ORD' + Date.now();
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, order_id, customer_email, total, subtotal, status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [userId, orderCode, req.user.email, totalAmount, totalAmount]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItemsData) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price_at_purchase]
            );

            await connection.query(
                'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Đặt hàng thành công",
            data: {
                order_id: orderId,
                order_code: orderCode,
                total_amount: totalAmount
            }
        });
    } catch (error) {
        await connection.rollback();
        console.error("Lỗi đặt hàng:", error.message);
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            message: status === 500 ? "Lỗi server" : error.message
        });
    } finally {
        connection.release();
    }
};


// GET /api/orders/:id   (:id là id số của đơn, ví dụ 8)
const getOrderById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        const order = rows[0];

        const isOwner = order && order.user_id === req.user.id;
        const isAdmin = req.user.role === 'admin';

        // Không tồn tại HOẶC không có quyền: cùng một câu trả lời
        if (!order || (!isOwner && !isAdmin)) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        const [items] = await pool.query(
            `SELECT oi.product_id, p.name, oi.quantity, oi.price_at_purchase
             FROM order_items oi
             JOIN products p ON p.id = oi.product_id
             WHERE oi.order_id = ?`,
            [order.id]
        );

        return res.json({ success: true, data: { ...order, items } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
module.exports = { createOrder, getOrderById };