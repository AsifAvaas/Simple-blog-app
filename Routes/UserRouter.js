const express = require('express')
const router = express.Router()
const User = require('../Models/UserModel')
const { body, validationResult } = require('express-validator')
const accountSid = process.env.Twilio_SID;
const authToken = process.env.Twilio_Token;
const serviceID= process.env.Twilio_Service_ID;
const client = require('twilio')(accountSid, authToken);
require('dotenv').config()

router.post('/signup',
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.json({ success: false, errorMessage: result.array() })
        }

        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.json({ success: false, error: "Email ID already exists" })
            }

            user = await new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }).save()

            res.json({ success: true, message: "User Registered Successfully" })

        } catch (error) {
            console.error(error.message)
            res.status(500).json({ success: false, message: "Internal Server Error" })

        }
    })


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, error: "Invalid Credentials" })
        }
        if (user.password !== password) {
            return res.json({ success: false, error: "Invalid Credentials" })
        }
        res.json({ success: true, message: "User Logged in Successfully" })
    } catch (error) {
        return res.json({ success: false, error: "Invalid Credentials" })
    }
})



router.post('/send-otp',async(req,res)=>{
    try {
        const {phone}=req.body;
        
        const verification = await client.verify.v2.services(serviceID)
        .verifications
        .create({ to: phone, channel: 'sms' });
        
              res.json({ success: true, message: "OTP Sent Successfully", status: verification.status });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send OTP",error:error.message });
    }
})


router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body; // OTP is entered by the user

        const verification_check = await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks
            .create({ to: phone, code: otp });

        if (verification_check.status === "approved") {
            res.json({ success: true, message: "OTP Verified Successfully" });
        } else {
            res.json({ success: false, message: "Invalid OTP or Expired OTP" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to verify OTP", error: error.message });
    }
});





module.exports = router