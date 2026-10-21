-- CREATE DATABASE shop_db;
-- USE shop_db; -- Lệnh bắt buộc để MySQL biết bạn sẽ thao tác trên database nào

-- CREATE TABLE products (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     name VARCHAR(100),
--     price DECIMAL(15,2),
--     quantity INT
-- );

-- INSERT INTO products (name, price, quantity)
-- VALUES
-- ('Giày thể thao', 1500000.00, 10),
-- ('Áo thun', 250000.00, 20);

-- INSERT INTO products (name, price, quantity) 
-- VALUES 
-- ('Giày Nike Air Max', 2500000, 15),
-- ('Áo phông Adidas', 450000, 50),
-- ('Quần Jean nam', 350000, 30),
-- ('Balo chống nước', 200000, 10),
-- ('Mũ lưỡi trai', 120000, 100);


-- 1. Chỉ định rõ sẽ thao tác trên cơ sở dữ liệu nào
USE shop_db;

-- 2. Xóa bảng users cũ đi (nếu nó đang tồn tại) để dọn đường
DROP TABLE IF EXISTS users;

-- 3. Tạo lại bảng users phiên bản nâng cấp (có password, role, token_version)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  token_version INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tạo thêm bảng refresh_tokens để phục vụ bảo mật JWT nâng cao
CREATE TABLE refresh_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);