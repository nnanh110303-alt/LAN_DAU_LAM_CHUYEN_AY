const fs = require("fs");

// Nội dung cần ghi vào file
const content = "Laptop\nMouse\nKeyboard";

// Step 1: Ghi dữ liệu vào file products.txt
fs.writeFile("products.txt", content, "utf8", (err) => {
    if (err) {
        console.error("Lỗi khi ghi file:", err);
        return;
    }
    console.log("--> Đã ghi file products.txt thành công!\n");

    // Step 2: Đọc dữ liệu từ file products.txt vừa tạo và in ra màn hình
    fs.readFile("products.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Lỗi khi đọc file:", err);
            return;
        }
        console.log("--- DANH SÁCH SẢN PHẨM ---");
        console.log(data);
    });
});