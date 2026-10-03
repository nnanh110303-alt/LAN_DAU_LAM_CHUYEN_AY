/**
 * Module gửi email xác nhận đơn hàng
 */
function sendOrderConfirmation(order) {
    const { orderId, customerEmail, totalAmount, items } = order;

    console.log(`\n===== EMAIL XÁC NHẬN ĐƠN HÀNG =====`);
    console.log(`Gửi tới: ${customerEmail}`);
    console.log(`Mã đơn: ${orderId}`);
    console.log(`Tổng tiền: ${totalAmount.toLocaleString()}đ`);
    console.log(`Sản phẩm:`);
    items.forEach(item => {
        console.log(`  - ${item.name}: ${item.quantity} x ${item.price.toLocaleString()}đ`);
    });
    console.log(`Nội dung: Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.`);
    console.log(`====================================\n`);

    return { success: true, messageId: `email_${Date.now()}` };
}

module.exports = {
    sendOrderConfirmation
};