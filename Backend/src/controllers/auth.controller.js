const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const utils = require('../utils/otpgenerator')
const sendEmail = require('../services/email.service')
const bcrypt = require('bcryptjs')
const otpModel = require('../models/otp.model')


async function userRegister(req, res) {
    const { email, password } = req.body;

    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
        return res.status(400).json({ error: "User already exists" });
    }

    try {
        const user = await userModel.create({ email, password });

        const otp = utils.generateOtp();
        const html = utils.getOtpHtml(otp);

        const otpHash = await bcrypt.hash(otp,10);
        await otpModel.create({
        email,
        user:user._id,
        otpHash
        })

        await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html)

        res.status(201).json({ message: "Verify the email" });
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function userLogin(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.verified) {
        return res.status(401).json({
            message: "Email not verified"
        })
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });    

    res.status(200).json({ message : "Login Successfully",token });
}

async function userLogout(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" },);
}

async function verifyEmail(req, res) {

    const { otp, email } = req.body;

    const otpDoc = await otpModel.findOne({ email });

    if (!otpDoc) {
        return res.status(400).json({
            message: "OTP not found"
        });
    }

    const isMatch = await bcrypt.compare(
        otp,
        otpDoc.otpHash
    );

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    await userModel.findByIdAndUpdate(
        otpDoc.user,
        { verified: true }
    );

    await otpModel.deleteMany({
        user: otpDoc.user
    });

    return res.status(200).json({
        message: "Email verified successfully"
    });
}


module.exports = {userRegister ,userLogin,userLogout ,verifyEmail}