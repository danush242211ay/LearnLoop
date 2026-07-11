const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authInstructor(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.role !== 'instructor') {
            return res.status(403).json({ message: "You don't have access" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = {authInstructor};
