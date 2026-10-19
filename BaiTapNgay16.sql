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

USE shop_db;

SELECT * FROM products;