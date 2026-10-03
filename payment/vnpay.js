// payment/vnpay.js
const crypto = require("crypto"); // giả lập

function createPaymentUrl(orderId, amount, returnUrl) {
    // Logic thực tế sẽ gọi API VNPay, ký chữ ký, tạo URL
    console.log(`[VNPay] Tạo link thanh toán cho đơn ${orderId}, số tiền ${amount}`);
    return `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?orderId=${orderId}&amount=${amount}`;
}

function verifyPayment(queryParams) {
    // Kiểm tra chữ ký, trạng thái giao dịch từ VNPay
    console.log("[VNPay] Xác nhận giao dịch thành công");
    return { success: true, transactionId: "VNPAY123456" };
}

module.exports = {
    createPaymentUrl,
    verifyPayment
};