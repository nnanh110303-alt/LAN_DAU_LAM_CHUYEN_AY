// const express = require("express");
// const router = express.Router();
// const productController = require("../controllers/product.controller");

// // Lấy danh sách sản phẩm
// router.get("/", productController.getAllProducts);

// // Lấy chi tiết 1 sản phẩm
// router.get("/:id", productController.getProductById);

// // Thêm sản phẩm mới
// router.post("/", productController.createProduct);

// // Mua hàng (thanh toán)
// router.post("/checkout", productController.checkoutProduct);


// module.exports = router;

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Công khai: ai cũng xem được
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Chỉ admin: phải đăng nhập (401) VÀ đúng role (403)
router.post("/", protect, authorizeRoles("admin"), productController.createProduct);

// Mua hàng: chỉ cần đăng nhập
router.post("/checkout", protect, productController.checkoutProduct);

module.exports = router;