/**
 * Module tính toán cho hệ thống bán hàng
 * - add: tính tổng tiền nhiều sản phẩm
 * - subtract: tính số tiền còn lại sau khi trừ giảm giá / trả hàng
 * - multiply: tính thành tiền = số lượng × đơn giá
 * - divide: chia đều doanh thu / tính đơn giá trung bình
 */

function add(a, b) {
    // Có thể dùng để cộng tổng tiền nhiều dòng hóa đơn
    return a + b;
}

function subtract(a, b) {
    // Ví dụ: tổng tiền - giảm giá, hoặc tiền khách đưa - tiền hàng
    return a - b;
}

function multiply(a, b) {
    // Thành tiền = số lượng × đơn giá
    return a * b;
}

function divide(a, b) {
    // Chia doanh thu, tính đơn giá trung bình, tránh chia cho 0
    if (b === 0) {
        throw new Error("Không thể chia cho 0 – lỗi nghiệp vụ!");
    }
    return a / b;
}

// Xuất nhiều hàm cùng lúc
module.exports = {
    add,
    subtract,
    multiply,
    divide
};