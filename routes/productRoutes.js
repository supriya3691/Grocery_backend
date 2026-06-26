const controller = require("../Controller/productController")
const express = require("express")
const upload = require("../middlewares/imageMiddleware")
const protected = require("../middlewares/adminMiddleware")
const searchController = require("../Controller/searchController")

const router = express.Router()


router.post("/add-product", protected.adminMiddleware, upload.single("image"), controller.createProduct)
router.get("/show-products", controller.getProducts)
router.get("/all-products", controller.getProducts)   // alias used by ShowProducts.jsx
router.get("/show-products/:id", controller.getProductById)
router.get("/search", searchController.searchProducts)



module.exports = router