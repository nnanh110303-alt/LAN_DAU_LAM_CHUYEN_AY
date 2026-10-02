// payment/payment.interface.js
/**
 * Mọi cổng thanh toán phải tuân thủ interface này
 * → Dễ thay thế VNPay ↔ Momo mà không sửa code ở order.js
 */
module.exports = {
    createPaymentUrl: (orderId, amount, returnUrl) => {
        throw new Error("Phải implement createPaymentUrl");
    },
    verifyPayment: (queryParams) => {
        throw new Error("Phải implement verifyPayment");
    }
};