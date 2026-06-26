const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const productRoutes = require("./routes/productRoutes.js")
const path = require("path")
const fs = require("fs")
const adminRoutes = require("./routes/adminRoutes.js")
const emailRoutes = require("./routes/emailRoutes.js")
const cartRoutes = require("./routes/cartRoutes.js")
const cors = require("cors")

const app = express()
app.use(express.json())

// ✅ Dynamic CORS — allows localhost in dev and FRONTEND_URL (Vercel) in production
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    process.env.FRONTEND_URL,           // e.g. https://your-app.vercel.app
].filter(Boolean)   // removes undefined if FRONTEND_URL not set

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS blocked: ${origin}`))
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

// ✅ Health check — used by Render to confirm server is alive (also wakes it up)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// ✅ Root route — avoids "Cannot GET /" 404 on Render dashboard
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Grocery API is running 🛒", version: "1.0.0" })
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Database connected successfully')
    })
    .catch((error) => {
        console.error('❌ DB connection error:', error.message)
    })

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api", productRoutes)
app.use("/admin", adminRoutes)
app.use("/email", emailRoutes)
app.use("/cart", cartRoutes)

// Route to get all uploaded images
app.get("/uploads/all-images", (req, res) => {
    const uploadsDir = path.join(__dirname, "uploads")
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ msg: "Could not read uploads folder" })
        }
        const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]
        const imageFiles = files.filter(file =>
            imageExtensions.includes(path.extname(file).toLowerCase())
        )
        const baseUrl = `${req.protocol}://${req.get("host")}`
        const imageUrls = imageFiles.map(file => ({
            filename: file,
            url: `${baseUrl}/uploads/${file}`
        }))
        res.status(200).json({ success: true, total: imageUrls.length, images: imageUrls })
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`)
})