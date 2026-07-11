const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const courseModel = require('../models/course.model');


async function instructorRegister(req, res) {
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const isUserExist = await userModel.findByIdAndUpdate(decoded.id , { role: "instructor" });

    if (!isUserExist) {
        return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Instructor registered successfully" });

}

async function uploadCourse(req, res) {

    const { title, description, price, category, image } = req.body;

    if (!title || !description || !price || !category || !image) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newCourse = await courseModel.create({
            title,
            description,
            price,
            category,
            image,
            instructor: req.user._id
        });
        res.status(201).json({ message: "Course uploaded successfully", course: newCourse });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

}

async function getInstructorCourses(req, res) {
    
    const courses = await courseModel.find({ instructor: req.user._id });

    res.status(200).json({ courses });
}

module.exports = {instructorRegister , getInstructorCourses , uploadCourse};