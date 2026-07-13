const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const courseModel = require('../models/course.model');
const uploadFile = require('../services/storage.service');
const lessonModel = require('../models/lesson.model');

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

    const { title, description, price, category } = req.body;
    const image = req.file;

    if (!title || !description || !price || !category || !image) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await uploadFile(image.buffer)

        const newCourse = await courseModel.create({
            title,
            description,
            price,
            category,
            image : result.url,
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

async function uploadLessons(req, res) {

    const { title, description, duration, order,isPreview} = req.body;
    const  image = req.file;
    const { courseId } = req.params;

    if (!title  || !order || !courseId || !image) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await uploadFile(image.buffer)

        const newLesson = await lessonModel.create({
            title,
            description,
            duration,
            order,
            isPreview,
            videoUrl : result.url,
            course : courseId,
        });
        res.status(201).json({ message: "Course uploaded successfully", Lesson : newLesson });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

}

async function getInstructorLessons(req, res) {
    const { courseId } = req.params;

    const lessons = await lessonModel.find({ course: courseId });

    res.status(200).json({ lessons });
}

module.exports = {instructorRegister , getInstructorCourses , uploadCourse , uploadLessons , getInstructorLessons};