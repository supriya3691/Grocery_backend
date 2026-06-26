const Product = require("../models/Products")

// ✅ Fixed: search is now optional; supports category, sortBy, order, page, limit
// Used by: GetProducts (search+filter), FruitProducts, VegetableProducts, FoodGrains (category only)
exports.searchProducts = async(req, res) => {
    try {
        const { search, category, sortBy = "createdAt", order = "desc", page = 1, limit = 50 } = req.query

        // At least one of search or category must be provided
        if (!search && !category) {
            return res.status(400).json({ msg: "Please provide a search term or category" })
        }

        // Build query dynamically
        const query = {}

        if (search) {
            query.name = { $regex: search, $options: "i" }
        }

        if (category) {
            query.category = category
        }

        // Sort direction
        const sortOrder = order === "asc" ? 1 : -1
        const sortField = ["price", "name", "createdAt"].includes(sortBy) ? sortBy : "createdAt"

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const products = await Product.find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit))

        // Return as "data" so all frontend components read res.data.data consistently
        res.status(200).json({ data: products, total: products.length })

    } catch(error) {
        res.status(500).json({ msg: error.message })
    }
}