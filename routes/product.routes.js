const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Lấy danh sách sản phẩm
router.get("/", productController.getAllProducts);

// Lấy chi tiết 1 sản phẩm
router.get("/:id", productController.getProductById);

// Thêm sản phẩm mới
router.post("/", productController.createProduct);

// Mua hàng (thanh toán)
router.post("/checkout", productController.checkoutProduct);


module.exports = router;

