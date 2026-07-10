const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

async function userRegister(req, res) {
    const { email, password } = req.body;

    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
        return res.status(400).json({ error: "User already exists" });
    }

    try {
        const user = await userModel.create({ email, password });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.status(201).json({ message: "User registered successfully", token });
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


module.exports = {userRegister ,userLogin,userLogout}