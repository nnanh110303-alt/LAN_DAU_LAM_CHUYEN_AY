// tax.js
const math = require("./math");

/**
 * Module tính thuế cho hệ thống bán hàng
 * - Tính VAT 10% (phổ biến ở Việt Nam)
 * - Tính thuế xuất khẩu (nếu có)
 * - Tách biệt hoàn toàn với logic thanh toán
 */

function calculateVAT(amount, rate = 0.1) {
    // rate mặc định 10%
    if (amount < 0) {
        throw new Error("Số tiền không được âm");
    }
    return math.multiply(amount, rate);
}

function calculateTotalWithVAT(amount, rate = 0.1) {
    const vat = calculateVAT(amount, rate);
    return math.add(amount, vat);
}

function calculateExportTax(amount, rate = 0.05) {
    // Ví dụ thuế xuất khẩu 5%
    return math.multiply(amount, rate);
}

module.exports = {
    calculateVAT,
    calculateTotalWithVAT,
    calculateExportTax
};