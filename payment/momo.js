// payment/momo.js
function createPaymentUrl(orderId, amount, returnUrl) {
    console.log(`[Momo] Tạo link thanh toán cho đơn ${orderId}, số tiền ${amount}`);
    return `https://test-payment.momo.vn/v2/gateway/pay?orderId=${orderId}&amount=${amount}`;
}

function verifyPayment(queryParams) {
    console.log("[Momo] Xác nhận giao dịch thành công");
    return { success: true, transactionId: "MOMO789012" };
}

module.exports = {
    createPaymentUrl,
    verifyPayment
};