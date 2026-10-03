const order = require("./order");

console.log("========== TEST THANH TOÁN VNPAY ==========");
const ketQuaVnpay = order.createOrder({
    items: [
        { name: "Áo thun", quantity: 2, price: 250000 },
        { name: "Quần jean", quantity: 1, price: 450000 }
    ],
    customerEmail: "khachhang@email.com",
    discount: 50000
}, "vnpay");   // dùng VNPay

console.log("Kết quả tạo đơn hàng (VNPay):");
console.log(ketQuaVnpay);

console.log("\n========== TEST THANH TOÁN MOMO ==========");
const ketQuaMomo = order.createOrder({
    items: [
        { name: "Áo thun", quantity: 2, price: 250000 },
        { name: "Quần jean", quantity: 1, price: 450000 }
    ],
    customerEmail: "khachhang@email.com",
    discount: 50000
}, "momo");    // dùng Momo

console.log("Kết quả tạo đơn hàng (Momo):");
console.log(ketQuaMomo);