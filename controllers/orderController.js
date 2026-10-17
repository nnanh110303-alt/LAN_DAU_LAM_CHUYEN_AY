const pool = require('../config/db'); 

const createOrder = async (req, res) => {
    const { user_id, items } = req.body;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Thiếu user_id hoặc danh sách sản phẩm"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        let totalAmount = 0;
        const orderItemsData = [];

        // 1. Tính tổng tiền + lấy giá hiện tại + KHÓA DÒNG SẢN PHẨM (Row-level Lock)
        for (const item of items) {
            // [SỬA ĐỔI QUAN TRỌNG]: Thêm "FOR UPDATE" vào cuối câu lệnh SELECT
            // Tác dụng: Báo cho MySQL khóa dòng dữ liệu của sản phẩm này lại. 
            // Nếu có luồng khác cũng muốn SELECT ... FOR UPDATE sản phẩm này, nó phải đứng chờ.
            const [products] = await connection.query(
                'SELECT id, name, price, quantity FROM products WHERE id = ? FOR UPDATE',
                [item.product_id]
            );

            if (products.length === 0) {
                throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại`);
            }

            const product = products[0];

            if (product.quantity < item.quantity) {
                throw new Error(`Sản phẩm "${product.name}" không đủ hàng (chỉ còn ${product.quantity})`);
            }

            const lineTotal = product.price * item.quantity;
            totalAmount += lineTotal;

            orderItemsData.push({
                product_id: product.id,
                quantity: item.quantity,
                price_at_purchase: product.price
            });
        }

        // 2. Tạo đơn hàng
        const orderCode = 'ORD' + Date.now();
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, order_id, total, subtotal) 
             VALUES (?, ?, ?, ?)`,
            [user_id, orderCode, totalAmount, totalAmount]
        );

        const orderId = orderResult.insertId;

        // 3. Thêm chi tiết đơn hàng + trừ kho
        for (const item of orderItemsData) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price_at_purchase]
            );

            // Trừ số lượng tồn kho an toàn vì dòng dữ liệu này đang bị giữ khóa độc quyền
            await connection.query(
                'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // 4. Hoàn tất Giao dịch
        // Khi gọi COMMIT, MySQL sẽ ghi nhận thay đổi và tự động MỞ KHÓA (Release Lock) 
        // cho các dòng dữ liệu đã bị FOR UPDATE giữ lại.
        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công",
            data: {
                order_id: orderId,
                order_code: orderCode,
                total_amount: totalAmount
            }
        });

    } catch (error) {
        // Nếu có lỗi (ví dụ phát hiện kho không đủ hàng), Giao dịch bị hủy.
        // ROLLBACK cũng sẽ tự động MỞ KHÓA các dòng đang bị giữ.
        await connection.rollback();
        console.error("Lỗi đặt hàng:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Đặt hàng thất bại"
        });
    } finally {
        connection.release();
    }
};

module.exports = { createOrder };