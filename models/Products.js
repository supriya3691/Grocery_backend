const mongoose = require("mongoose")

const category_Enum = [
    "vegetables", "fruits","food-grains"
]

const Unit_Enum = [
    "500gm", "1kg","2kgs","5kgs"
]

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },desc:{
        type:String,
        required:true
    },
    price:{
        type: Number
    },
    categogy:{
        type:String,
        values:category_Enum
    },
    unit:{
        type:String,
        values: Unit_Enum
    },
    image:{
        type:String,

    },
    isActive:{
        type:Boolean
    }
},{timestamps:true})

module.exports = mongoose.model("Product", productSchema)