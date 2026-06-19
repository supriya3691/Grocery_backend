const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const productRoutes = require("./routes/productRoutes.js")
const path = require("path")
const adminRoutes = require("./routes/adminRoutes.js")
const emailRoutes = require("./routes/emailRoutes.js")
const cartRoutes = require("./routes/cartRoutes.js")

// import express from "express" // this is for module method in the package.json

const app = express()


console.log("checking", process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
    // console.log(MONGO_URI)

    .then(() => {
        console.log('database connected sucessfully')
    })
    .catch((error) => {
        console.log(error.message)
    })

app.use(express.json())
app.use("/api", productRoutes)
app.use("/admin", adminRoutes)
app.use("/email", emailRoutes)
app.use("/cart", cartRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is ready: http://localhost:${PORT}`)
})