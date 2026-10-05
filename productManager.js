const fs = require("fs");
const path = require("path");

// Đường dẫn đến file sản phẩm (nằm trong thư mục data)
const productsFile = path.join(__dirname, "data", "products.txt");

// ====================== 1. TẠO THƯ MỤC data NẾU CHƯA CÓ ======================
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"));
  console.log("✅ Đã tạo thư mục data/");
}

// ====================== 2. GHI DỮ LIỆU MẪU LẦN ĐẦU ======================
function initProducts() {
  const sampleData = `Laptop|15000000|12
Mouse|250000|50
Keyboard|450000|30
Tai nghe Bluetooth|890000|25
Màn hình 27 inch|3200000|8`;

  if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, sampleData, "utf8");
    console.log("✅ Đã tạo file products.txt với dữ liệu mẫu\n");
  }
}

// ====================== 3. ĐỌC VÀ HIỂN THỊ SẢN PHẨM ======================
function showProducts() {
  fs.readFile(productsFile, "utf8", (err, data) => {
    if (err) {
      console.log("❌ Lỗi đọc file:", err.message);
      return;
    }

    console.log("\n========== CỬA HÀNG ĐIỆN TỬ ==========");
    console.log("STT | Tên sản phẩm            | Giá            | Tồn kho");
    console.log("-------------------------------------------------------");

    const lines = data.trim().split("\n");

    lines.forEach((line, index) => {
      const [name, price, stock] = line.split("|");
      const stt = String(index + 1).padStart(2, "0");
      const priceFormat = Number(price).toLocaleString("vi-VN") + "đ";

      console.log(
        `${stt}  | ${name.padEnd(22)} | ${priceFormat.padEnd(13)} | ${stock}`
      );
    });

    console.log("=======================================================\n");
  });
}

// ====================== 4. THÊM SẢN PHẨM MỚI (KHÔNG GHI ĐÈ) ======================
function addProduct(name, price, stock) {
  const newLine = `\n${name}|${price}|${stock}`;

  fs.appendFile(productsFile, newLine, "utf8", (err) => {
    if (err) {
      console.log("❌ Lỗi khi thêm sản phẩm:", err.message);
      return;
    }
    console.log(`✅ Đã thêm sản phẩm: ${name}`);
    // Hiển thị lại danh sách sau khi thêm
    showProducts();
  });
}

// ====================== CHẠY THỬ ======================
initProducts();          // Tạo file mẫu nếu chưa có
showProducts();          // Hiển thị danh sách hiện tại

// Thử thêm sản phẩm mới sau 1 giây
setTimeout(() => {
  addProduct("Bàn phím cơ", 1250000, 15);
}, 1000);