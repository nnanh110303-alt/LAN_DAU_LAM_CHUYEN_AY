// email/orderConfirmation.js
/**
 * Chỉ chịu trách nhiệm gửi email xác nhận đơn hàng
 * Không biết gì về thanh toán hay tính thuế
 */

function sendOrderConfirmation(order) {
    const { orderId, customerEmail, totalAmount, items } = order;

    // Trong thực tế sẽ dùng nodemailer hoặc service như SendGrid
    console.log(`\n===== EMAIL XÁC NHẬN ĐƠN HÀNG =====`);
    console.log(`Gửi tới: ${customerEmail}`);
    console.log(`Mã đơn: ${orderId}`);
    console.log(`Tổng tiền: ${totalAmount.toLocaleString()}đ`);
    console.log(`Nội dung: Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.`);
    console.log(`====================================\n`);

    return { success: true, messageId: `email_${Date.now()}` };
}

module.exports = {
    sendOrderConfirmation
};