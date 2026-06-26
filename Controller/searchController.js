const Product = require("../models/Products")

// Supports search, category filter, sorting, pagination
// category can be: 'fruits', 'vegetables', 'food-grains', 'dairy', '' or 'all' (returns all)
exports.searchProducts = async(req, res) => {
    try {
        const { search, category, sortBy = "createdAt", order = "desc", page = 1, limit = 50 } = req.query

        // Build query dynamically
        const query = {}

        if (search) {
            query.name = { $regex: search, $options: "i" }
        }

        // Only apply category filter if it's a real category (not empty or 'all')
        if (category && category !== "all" && category !== "All") {
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