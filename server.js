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

// import express from "express" // this is for module method in the package.json

const app = express()
app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


console.log("checking", process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
    // console.log(MONGO_URI)
    .then(() => {
        console.log('database connected sucessfully')
    })
    .catch((error) => {
        console.log(error.message)
    })

// app.use(express.json())

app.use("/uploads", express.static("uploads"))
// app.use("/api", productRoutes)
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

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is ready: http://localhost:${PORT}`)
})