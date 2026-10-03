const tax = require("../tax");
const vnpay = require("../payment/vnpay");
const momo = require("../payment/momo");
const email = require("../email");

function createOrder(orderData, paymentGateway = "vnpay") {
    const { items, customerEmail, discount = 0 } = orderData;

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

    // 5. Chọn cổng thanh toán
    const payment = paymentGateway === "momo" ? momo : vnpay;
    const paymentUrl = payment.createPaymentUrl(orderId, totalWithVAT, "https://myshop.com/return");

    // 6. Gửi email xác nhận
    email.sendOrderConfirmation({
        orderId,
        customerEmail,
        totalAmount: totalWithVAT,
        items
    });

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