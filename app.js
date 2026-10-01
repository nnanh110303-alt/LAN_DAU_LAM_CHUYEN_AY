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
// function getUser() {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({ id: 1, name: "Nguyễn Văn A" });
//         }, 1000); // Giả lập mất 1s
//     });
// }

// function getProducts() {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(["Laptop", "Chuột không dây", "Bàn phím cơ"]);
//         }, 1500); // Giả lập mất 1.5s
//     });
// }

// function getOrders() {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve([{ orderId: 101, total: 500 }]);
//         }, 800); // Giả lập mất 0.8s
//     });
// }

// 2. Hàm main xử lý bằng Async/Await
// async function main() {
//     console.log("Bắt đầu tải dữ liệu...");
//     const startTime = Date.now();

//     // Chạy tuần tự từng cái một (Sequential execution)
//     const user = await getUser();
//     console.log("Đã lấy User:", user);

//     const products = await getProducts();
//     console.log("Đã lấy Products:", products);

//     const orders = await getOrders();
//     console.log("Đã lấy Orders:", orders);

//     const endTime = Date.now();
//     console.log(`===> Hoàn thành tất cả trong: ${(endTime - startTime) / 1000}s`);
// }

// main();



// ===== Các hàm giả lập API =====
function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ Lấy thông tin user thành công");
      resolve({ id: 1, name: "Nguyễn Văn A" });
    }, 1000); // 1 giây
  });
}

function getProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ Lấy danh sách sản phẩm gợi ý thành công");
      resolve([
        { id: 101, name: "iPhone 16" },
        { id: 102, name: "MacBook Pro" },
      ]);
    }, 1500); // 1.5 giây
  });
}

// Yêu cầu 1: getOrders có 50% khả năng bị lỗi
function getOrders() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isError = Math.random() < 0.5; // 50% lỗi

      if (isError) {
        reject("Lỗi kết nối Server!");
      } else {
        console.log("✅ Lấy lịch sử đơn hàng thành công");
        resolve([
          { id: 1001, total: 25000000 },
          { id: 1002, total: 4500000 },
        ]);
      }
    }, 800); // 0.8 giây
  });
}

// ===== Hàm chính =====
async function main() {
  console.log("🚀 Bắt đầu tải Dashboard...\n");

  const start = Date.now();

  try {
    // Yêu cầu 2: Chạy song song bằng Promise.all
    const [user, products, orders] = await Promise.all([
      getUser(),
      getProducts(),
      getOrders(),
    ]);

    console.log("\n===== DỮ LIỆU DASHBOARD =====");
    console.log("User:", user);
    console.log("Products:", products);
    console.log("Orders:", orders);
  } catch (error) {
    // Bắt lỗi nếu getOrders bị reject
    console.error("\n❌ Đã xảy ra lỗi:", error);
    console.log("Ứng dụng vẫn tiếp tục chạy, không bị sập!");
  }

  const end = Date.now();
  console.log(`\n⏱️  Tổng thời gian thực tế: ${((end - start) / 1000).toFixed(2)} giây`);
}

// Chạy chương trình
main();