
const Cart = require("../models/Cart")
const product = require("../models/Products")
const User = require("../models/User")

exports.addToCart = async(req, res)=>{
    try{
        const userId = req.userId;
        const {productId, quantity} = req.body
        if(quantity<1){
            return res.status(400).json({msg:"pls add a product"})
        }
        const productExists = await product.findById(productId)
        if(!productExists){
            return res.status(400).json({msg:"product not found"})
        }

        let cart = await Cart.findOne({user:userId})
        if(!cart){
            cart = await Cart.create({
                user:userId,
                items:[{product:productId,quantity}]
            })
            return res.status(200).json({
                success:true,
                message:"Cart created & product added",
                cart
            })
        }
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        )
        if(itemIndex > -1){
            cart.items[itemIndex].quantity += quantity
        }else{
            cart.items.push({product:productId, quantity})
        }
        await cart.save()
        res.json({
            success:true,
            message:"product added success",
        })
    }catch(error){
        res.status(500).json({msg:error.message})
    }
}

exports.getCartItems=async (req, res) =>{
    try{
        const cart = await Cart.findOne({user:req.userId})
        .populate("user", "email")
        .populate("items.product")
        if(!cart){
            return res.status(404).json({msg:"cart not found"})
        }
        res.json({success:true, cart})
    }catch(error){
        res.status(500).json({msg:error.message})
    }
}

exports.removeFromCart = async(req,res)=>{
    try{
        const cart = await Cart.findOneAndUpdate(
            {user: req.userId},
            {$pull: {items: {product: req.params.productId}}},
            {new:true}
        ) 
        res.json({
            success:true,
            message:"product removed",
            cart
        })
    }catch(error){
        res.status(500).json({message: error.message});
    }
}