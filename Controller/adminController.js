const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


exports.adminRegister = async(req, res)=>{
    try{
        const {name, email, password} = req.body;

        const adminRecord = await Admin.findOne({email})
        if(adminRecord){
            return res.status(400).json({msg:"email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const admin = await Admin.create({
            name, email, password: hashedPassword
        });

        return res.status(201).json({msg:"admin registered"})
    } catch(error){
        res.status(500).json({msg:error.message})
    }
}
exports.adminLogin = async(req, res) =>{
    try{
        const{email, password} = req.body;

        const adminRecord = await Admin.findOne({email})

        if(!adminRecord){
            return res.status(401).json({msg:"invalid credentials"})
        }
        const adminPassword = await bcrypt.compare(password, adminRecord.password)
        if(!adminPassword){
            return res.status(401).json({msg:"invalid credentials"})
        }
        const token = jwt.sign(
            {adminId:adminRecord._id}, process.env.JWT_SECRET, {expiresIn: '7d'}
        )

        return res.status(200).json({msg:"Login success", token})
    } 
    catch (error){
        res.status(500).json({msg:error.message})
    }
}