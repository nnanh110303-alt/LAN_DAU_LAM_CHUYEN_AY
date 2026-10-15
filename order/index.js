const tax = require("../tax");
const vnpay = require("../payment/vnpay");
const momo = require("../payment/momo");
const email = require("../email");
const pool = require("../config/db"); // Thêm kết nối database

/**
 * Tạo đơn hàng an toàn (có trừ kho bằng Transaction)
 * @param {Object} orderData 
 * @param {Array} orderData.items - Mảng sản phẩm: [{ productId, name, price, quantity }]
 * @param {string} orderData.customerEmail
 * @param {string} orderData.customerName
 * @param {number} orderData.discount
 * @param {string} paymentGateway - "vnpay" | "momo"
 */
async function createOrder(orderData, paymentGateway = "vnpay") {
    const { items, customerEmail, customerName, discount = 0 } = orderData;

    if (!items || items.length === 0) {
        throw new Error("Đơn hàng không có sản phẩm");
    }

    // 1. Tính tiền hàng
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.quantity * item.price;
    });

    // 2. Trừ giảm giá
    const afterDiscount = subtotal - discount;

    // 3. Tính thuế VAT
    const totalWithVAT = tax.calculateTotalWithVAT(afterDiscount);

    // 4. Tạo mã đơn
    const orderId = `ORD${Date.now()}`;

    // ==========================================
    // 5. TRANSACTION: Trừ kho + Lưu đơn hàng
    // ==========================================
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 5.1. Trừ số lượng tồn kho cho từng sản phẩm
        for (const item of items) {
            if (!item.productId) {
                throw new Error(`Sản phẩm "${item.name}" thiếu productId`);
            }

            const [updateResult] = await connection.query(
                `UPDATE products 
                 SET quantity = quantity - ? 
                 WHERE id = ? AND quantity >= ?`,
                [item.quantity, item.productId, item.quantity]
            );

            if (updateResult.affectedRows === 0) {
                throw new Error(`Sản phẩm "${item.name}" không đủ số lượng trong kho`);
            }
        }

        // 5.2. Lưu thông tin đơn hàng vào bảng orders
        // (Em có thể điều chỉnh cấu trúc bảng cho phù hợp)
        await connection.query(
            `INSERT INTO orders (order_id, customer_name, customer_email, subtotal, discount, vat, total, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                orderId,
                customerName || "Khách lẻ",
                customerEmail,
                subtotal,
                discount,
                tax.calculateVAT(afterDiscount),
                totalWithVAT
            ]
        );

        // 5.3. Lưu chi tiết từng sản phẩm trong đơn (bảng order_items - khuyến khích có)
        // Nếu em chưa có bảng order_items thì tạm bỏ phần này
        /*
        for (const item of items) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.productId, item.name, item.price, item.quantity]
            );
        }
        */

        // Commit thành công
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        console.error("Lỗi tạo đơn hàng, đã rollback:", error.message);
        throw error; // Ném lỗi ra ngoài để hàm gọi biết
    } finally {
        connection.release();
    }

    // ==========================================
    // 6. Chọn cổng thanh toán (sau khi đã trừ kho thành công)
    // ==========================================
    const payment = paymentGateway === "momo" ? momo : vnpay;
    const paymentUrl = payment.createPaymentUrl(orderId, totalWithVAT, "https://myshop.com/return");

    // 7. Gửi email xác nhận
    email.sendOrderConfirmation({
        orderId,
        customerEmail,
        totalAmount: totalWithVAT,
        items
    });

    // 8. Trả kết quả
    return {
        orderId,
        subtotal,
        discount,
        vat: tax.calculateVAT(afterDiscount),
        total: totalWithVAT,
        paymentUrl
    };
}

module.exports = {
    createOrder
};