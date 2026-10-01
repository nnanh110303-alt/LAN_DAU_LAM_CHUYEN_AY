// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/trang trinh', (req, res) => {
//   res.send('Xin chào! Server Express đang chạy thành công!');
// });

// app.listen(port, () => {
//   console.log(`Server đang chạy tại http://localhost:${port}`);
// });


// 1. Khai báo các hàm giả lập gọi API
function getUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id: 1, name: "Nguyễn Văn A" });
        }, 1000); // Giả lập mất 1s
    });
}

function getProducts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(["Laptop", "Chuột không dây", "Bàn phím cơ"]);
        }, 1500); // Giả lập mất 1.5s
    });
}

function getOrders() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{ orderId: 101, total: 500 }]);
        }, 800); // Giả lập mất 0.8s
    });
}

// 2. Hàm main xử lý bằng Async/Await
async function main() {
    console.log("Bắt đầu tải dữ liệu...");
    const startTime = Date.now();

    // Chạy tuần tự từng cái một (Sequential execution)
    const user = await getUser();
    console.log("Đã lấy User:", user);

    const products = await getProducts();
    console.log("Đã lấy Products:", products);

    const orders = await getOrders();
    console.log("Đã lấy Orders:", orders);

    const endTime = Date.now();
    console.log(`===> Hoàn thành tất cả trong: ${(endTime - startTime) / 1000}s`);
}

main();