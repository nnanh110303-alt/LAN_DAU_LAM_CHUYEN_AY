const order = require("./order");

const ketQua = order.createOrder({
    items: [
        { name: "Áo thun", quantity: 2, price: 250000 },
        { name: "Quần jean", quantity: 1, price: 450000 }
    ],
    customerEmail: "khachhang@email.com",
    discount: 50000
}, "vnpay"); // hoặc "momo"

console.log("Kết quả tạo đơn hàng:");
console.log(ketQua);