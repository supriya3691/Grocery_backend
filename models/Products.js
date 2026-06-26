const mongoose = require("mongoose")

const category_Enum = [
    "vegetables", "fruits", "food-grains", "dairy"
]

const Unit_Enum = [
    "500gm", "1kg", "2kgs", "5kgs"
]

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type: Number
    },
    category:{          // ✅ Fixed typo: was "categogy"
        type:String,
        enum: category_Enum  // ✅ Fixed: was "values:"
    },
    unit:{
        type:String,
        enum: Unit_Enum      // ✅ Fixed: was "values:"
    },
    image:{
        type:String,
    },
    isActive:{
        type:Boolean
    }
},{timestamps:true})

module.exports = mongoose.model("Product", productSchema)