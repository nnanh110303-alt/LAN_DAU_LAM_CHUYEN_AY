// const http = require("http");

// const server = http.createServer((req, res) => {
//     const url = req.url;
//     const method = req.method; // Lấy phương thức GET hoặc POST

//     // In ra Terminal để em theo dõi mỗi khi có lượt truy cập
//     console.log(`[REQUEST RECEIVED] Phương thức: ${method} | URL: ${url}`);

//     // Cấu hình Response Header mặc định hỗ trợ HTML & Tiếng Việt
//     res.writeHead(200, {
//         "Content-Type": "text/html; charset=utf-8"
//     });

//     // 1. TRANG CHỦ (GET /)
//     if (url === "/" && method === "GET") {
//         res.end(`
//             <!DOCTYPE html>
//             <html lang="vi">
//             <head>
//                 <meta charset="UTF-8">
//                 <title>Trang Chủ Store</title>
//                 <style>
//                     body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 40px; text-align: center; }
//                     .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: inline-block; }
//                     h1 { color: #2c3e50; }
//                     a { display: inline-block; margin: 10px; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 6px; }
//                     a:hover { background: #2980b9; }
//                 </style>
//             </head>
//             <body>
//                 <div class="card">
//                     <h1> Cửa Hàng Công Nghệ 2026</h1>
//                     <p>Chào mừng bạn đến với hệ thống bán hàng Demo Node.js!</p>
//                     <a href="/products">Xem Danh Sách Sản Phẩm (GET)</a>
//                 </div>
//             </body>
//             </html>
//         `);
//     }

//     // 2. DANH SÁCH SẢN PHẨM (GET /products)
//     else if (url === "/products" && method === "GET") {
//         res.end(`
//             <!DOCTYPE html>
//             <html lang="vi">
//             <head>
//                 <meta charset="UTF-8">
//                 <title>Danh Sách Sản Phẩm</title>
//                 <style>
//                     body { font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 40px; }
//                     .container { max-width: 600px; margin: 0 auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
//                     ul { list-style-type: none; padding: 0; }
//                     li { background: #ecf0f1; margin: 8px 0; padding: 12px; border-radius: 6px; font-weight: bold; }
//                     .form-box { margin-top: 25px; padding-top: 20px; border-top: 2px dashed #bdc3c7; }
//                     button { background: #2ecc71; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-size: 15px; }
//                     button:hover { background: #27ae60; }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <h1>📦 Danh Sách Sản Phẩm (GET)</h1>
//                     <ul>
//                         <li> Laptop Dell XPS 15</li>
//                         <li> Điện thoại iPhone 16 Pro</li>
//                         <li> Bàn phím Cơ Keychron K2</li>
//                     </ul>

//                     <div class="form-box">
//                         <h3>Thử nghiệm gửi phương thức POST:</h3>
//                         <!-- Form này gửi dữ liệu bằng phương thức POST tới /products -->
//                         <form action="/products" method="POST">
//                             <button type="submit"> Thêm sản phẩm mới (POST Request)</button>
//                         </form>
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `);
//     }

//     // 3. XỬ LÝ KHI NGƯỜI DÙNG THÊM SẢN PHẨM (POST /products)
//     else if (url === "/products" && method === "POST") {
//         res.end(`
//             <!DOCTYPE html>
//             <html lang="vi">
//             <head>
//                 <meta charset="UTF-8">
//                 <title>Kết Quả POST</title>
//                 <style>
//                     body { font-family: Arial, sans-serif; background-color: #e8f8f5; text-align: center; padding: 50px; }
//                     .success-card { background: white; padding: 30px; border-radius: 12px; display: inline-block; border: 2px solid #2ecc71; }
//                     h2 { color: #27ae60; }
//                     a { color: #3498db; font-weight: bold; }
//                 </style>
//             </head>
//             <body>
//                 <div class="success-card">
//                     <h2> Xử lý thành công!</h2>
//                     <p>Server đã nhận được phương thức <strong>POST</strong> từ bạn.</p>
//                     <p><i>(Trong thực tế, bước này sẽ thêm dữ liệu vào Database)</i></p>
//                     <a href="/products"> Quay lại danh sách sản phẩm</a>
//                 </div>
//             </body>
//             </html>
//         `);
//     }

//     // 4. KHÔNG TÌM THẤY TRANG (404 Not Found)
//     else {
//         res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
//         res.end(`
//             <div style="text-align: center; font-family: Arial; margin-top: 50px;">
//                 <h1 style="color: #e74c3c; font-size: 50px;">404</h1>
//                 <h2>Trang không tồn tại!</h2>
//                 <a href="/">Quay về trang chủ</a>
//             </div>
//         `);
//     }
// });

// server.listen(3000, () => {
//     console.log("Server nâng cao đang chạy tại http://localhost:3000");
// });




const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001

console.log("=================================");
console.log("ĐÂY LÀ APP.JS MỚI CỦA THẦY VÀ EM");
console.log("FILE ĐANG CHẠY:", __filename);
console.log("=================================");

;


// ==================================================
// 1. MIDDLEWARE
// ==================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==================================================
// 2. CHO PHÉP EXPRESS PHỤC VỤ FILE HTML
// ==================================================

app.use(express.static(__dirname));


// ==================================================
// 3. DỮ LIỆU SẢN PHẨM
// ==================================================

let products = [
  {
    id: 1,
    name: "Áo thun basic",
    price: 199000,
    stock: 50
  },
  {
    id: 2,
    name: "Quần jean slim",
    price: 399000,
    stock: 30
  },
  {
    id: 3,
    name: "Giày sneaker",
    price: 890000,
    stock: 15
  }
];


// ==================================================
// 4. TRANG CHỦ
// ==================================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ==================================================
// 5. NHẬN FORM THÊM SẢN PHẨM
// ==================================================

app.post("/products", (req, res) => {

  console.log("========== POST /products ==========");
  console.log("Dữ liệu nhận được:", req.body);

  const { name, price } = req.body;


  // Kiểm tra dữ liệu
  if (!name || price === undefined || price === "") {
    return res.status(400).send("Thiếu tên hoặc giá sản phẩm");
  }


  // Tạo ID mới
  const newId =
    products.length > 0
      ? Math.max(...products.map(p => p.id)) + 1
      : 1;


  // Tạo sản phẩm mới
  const newProduct = {
    id: newId,
    name: name,
    price: Number(price),
    stock: 0
  };


  // Thêm vào mảng products
  products.push(newProduct);


  console.log("Sản phẩm mới:", newProduct);
  console.log("Danh sách sản phẩm:", products);


  // Quay lại trang chủ
  res.redirect("/");
});


// ==================================================
// 6. API LẤY DANH SÁCH SẢN PHẨM
// ==================================================

app.get("/api/products", (req, res) => {

  res.json({
    success: true,
    total: products.length,
    data: products
  });

});


// ==================================================
// 7. API LẤY 1 SẢN PHẨM
// ==================================================

app.get("/api/products/:id", (req, res) => {

  const id = parseInt(req.params.id);

  const product = products.find(p => p.id === id);


  if (!product) {

    return res.status(404).json({
      success: false,
      message: "Không tìm thấy sản phẩm"
    });

  }


  res.json({
    success: true,
    data: product
  });

});


// ==================================================
// 8. API THÊM SẢN PHẨM BẰNG JSON
// ==================================================

app.post("/api/products", (req, res) => {

  const { name, price, stock } = req.body;


  if (!name || price === undefined) {

    return res.status(400).json({
      success: false,
      message: "Thiếu name hoặc price"
    });

  }


  const newId =
    products.length > 0
      ? Math.max(...products.map(p => p.id)) + 1
      : 1;


  const newProduct = {

    id: newId,

    name: name,

    price: Number(price),

    stock: Number(stock) || 0

  };


  products.push(newProduct);


  res.status(201).json({

    success: true,

    data: newProduct

  });

});


// ==================================================
// 9. CHẠY SERVER
// ==================================================

app.listen(PORT, () => {

  console.log("=================================");
  console.log("Server Express đang chạy");
  console.log(`http://localhost:${PORT}`);
  console.log("=================================");

});