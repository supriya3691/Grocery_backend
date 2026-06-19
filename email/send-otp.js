const nodemailer = require("nodemailer")
const dotEnv = require("dotenv")
dotEnv.config()


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
exports.sendOptEmail = async(email, otp)=>{
 await transporter.sendMail({
    from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "your OTP code",
    html: `<h2> your OTP is: ${otp} </h2> <p> valid for 5 mins </p>`,
  });
}