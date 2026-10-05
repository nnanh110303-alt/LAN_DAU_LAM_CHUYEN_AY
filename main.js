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



// // ===== Các hàm giả lập API =====
// function getUser() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("✅ Lấy thông tin user thành công");
//       resolve({ id: 1, name: "Nguyễn Văn A" });
//     }, 1000); // 1 giây
//   });
// }

// function getProducts() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("✅ Lấy danh sách sản phẩm gợi ý thành công");
//       resolve([
//         { id: 101, name: "iPhone 16" },
//         { id: 102, name: "MacBook Pro" },
//       ]);
//     }, 1500); // 1.5 giây
//   });
// }

// // Yêu cầu 1: getOrders có 50% khả năng bị lỗi
// function getOrders() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const isError = false; // 50% lỗi

//       if (isError) {
//         reject("Lỗi kết nối Server!");
//       } else {
//         console.log("✅ Lấy lịch sử đơn hàng thành công");
//         resolve([
//           { id: 1001, total: 25000000 },
//           { id: 1002, total: 4500000 },
//         ]);
//       }
//     }, 800); // 0.8 giây
//   });
// }

// // ===== Hàm chính =====
// async function main() {
//   console.log("🚀 Bắt đầu tải Dashboard...\n");

//   const start = Date.now();

//   try {
//     // Yêu cầu 2: Chạy song song bằng Promise.all
//     const [user, products, orders] = await Promise.all([
//       getUser(),
//       getProducts(),
//       getOrders(),
//     ]);

//     console.log("\n===== DỮ LIỆU DASHBOARD =====");
//     console.log("User:", user);
//     console.log("Products:", products);
//     console.log("Orders:", orders);
//   } catch (error) {
//     // Bắt lỗi nếu getOrders bị reject
//     console.error("\n❌ Đã xảy ra lỗi:", error);
//     console.log("Ứng dụng vẫn tiếp tục chạy, không bị sập!");
//   }

//   const end = Date.now();
//   console.log(`\n⏱️  Tổng thời gian thực tế: ${((end - start) / 1000).toFixed(2)} giây`);
// }

// // Chạy chương trình
// main();



const fs = require("fs");
const path = require("path");

// ====================== ĐƯỜNG DẪN ======================
const productsFile = path.join(__dirname, "data", "products.txt");
const orderFolder = path.join(__dirname, "order");

// Tạo thư mục order nếu chưa có
if (!fs.existsSync(orderFolder)) {
  fs.mkdirSync(orderFolder);
}

// ====================== 1. ĐỌC SẢN PHẨM TỪ FILE ======================
function getProducts() {
  try {
    const data = fs.readFileSync(productsFile, "utf8");
    const lines = data.trim().split("\n");

    return lines.map((line, index) => {
      const [name, price, stock] = line.split("|");
      return {
        id: index + 1,
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
      };
    });
  } catch (err) {
    console.log("❌ Không đọc được file sản phẩm:", err.message);
    return [];
  }
}

// ====================== 2. HIỂN THỊ SẢN PHẨM ======================
function showProducts(products) {
  console.log("\n========== DANH SÁCH SẢN PHẨM ==========");
  console.log("ID | Tên sản phẩm            | Giá            | Tồn kho");
  console.log("-------------------------------------------------------");

  products.forEach((p) => {
    const priceFormat = p.price.toLocaleString("vi-VN") + "đ";
    console.log(
      `${String(p.id).padStart(2, "0")} | ${p.name.padEnd(22)} | ${priceFormat.padEnd(13)} | ${p.stock}`
    );
  });
  console.log("=======================================================\n");
}

// ====================== 3. TẠO ĐƠN HÀNG ======================
function createOrder(selectedItems) {
  const orderId = "ORD" + Date.now();

  let subtotal = 0;
  selectedItems.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const discount = 50000; // giảm giá cố định giống bài cũ
  const vat = Math.round((subtotal - discount) * 0.1); // VAT 10%
  const total = subtotal - discount + vat;

  return {
    orderId,
    items: selectedItems,
    subtotal,
    discount,
    vat,
    total,
  };
}

// ====================== 4. GIẢ LẬP THANH TOÁN ======================
function payWithVNPay(order) {
  console.log("\n========== TEST THANH TOÁN VNPAY ==========");
  console.log(`[VNPay] Tạo link thanh toán cho đơn ${order.orderId}, số tiền ${order.total}`);

  return {
    ...order,
    paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?orderId=${order.orderId}&amount=${order.total}`,
  };
}

function payWithMomo(order) {
  console.log("\n========== TEST THANH TOÁN MOMO ==========");
  console.log(`[Momo] Tạo link thanh toán cho đơn ${order.orderId}, số tiền ${order.total}`);

  return {
    ...order,
    paymentUrl: `https://test-payment.momo.vn/v2/gateway/pay?orderId=${order.orderId}&amount=${order.total}`,
  };
}

// ====================== 5. GỬI EMAIL XÁC NHẬN ======================
function sendEmail(order) {
  console.log("\n===== EMAIL XÁC NHẬN ĐƠN HÀNG =====");
  console.log("Gửi tới: khachhang@email.com");
  console.log("Mã đơn:", order.orderId);
  console.log("Tổng tiền:", order.total.toLocaleString("vi-VN") + "đ");
  console.log("Sản phẩm:");
  order.items.forEach((item) => {
    console.log(`  - ${item.name}: ${item.quantity} x ${item.price.toLocaleString("vi-VN")}đ`);
  });
  console.log("Nội dung: Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.");
  console.log("====================================\n");
}

// ====================== 6. LƯU ĐƠN HÀNG VÀO FILE ======================
function saveOrder(order) {
  const fileName = `${order.orderId}.json`;
  const filePath = path.join(orderFolder, fileName);

  fs.writeFileSync(filePath, JSON.stringify(order, null, 2), "utf8");
  console.log(`✅ Đã lưu đơn hàng vào: order/${fileName}`);
}

// ====================== CHẠY THỬ TOÀN BỘ ======================
function main() {
  // 1. Lấy danh sách sản phẩm từ file
  const products = getProducts();
  if (products.length === 0) return;

  showProducts(products);

  // 2. Giả lập khách chọn mua (em có thể sửa số lượng ở đây)
  const selectedItems = [
    { name: "Laptop", price: 15000000, quantity: 1 },
    { name: "Mouse", price: 250000, quantity: 2 },
    { name: "Bàn phím cơ", price: 1250000, quantity: 1 },
  ];

  // 3. Tạo đơn hàng
  const order = createOrder(selectedItems);

  // 4. Thanh toán bằng MoMo (em đổi thành payWithVNPay nếu muốn)
  const paidOrder = payWithMomo(order);

  // 5. Gửi email
  sendEmail(paidOrder);

  // 6. In kết quả
  console.log("Kết quả tạo đơn hàng (Momo):");
  console.log({
    orderId: paidOrder.orderId,
    subtotal: paidOrder.subtotal,
    discount: paidOrder.discount,
    vat: paidOrder.vat,
    total: paidOrder.total,
    paymentUrl: paidOrder.paymentUrl,
  });

  // 7. Lưu đơn hàng bằng fs
  saveOrder(paidOrder);
}

// Chạy chương trình
main();