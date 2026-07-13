const courseModel = require('../models/course.model');
const lessonModel = require('../models/lesson.model');

async function getCourses(req, res) {
    try {
        const courses = await courseModel.find().populate('instructor', 'name');
        res.status(200).json({ courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getLessons(req, res) {
    const courseId = req.params.courseId;

    try{
        const lesson = await lessonModel.find( {course : courseId});
        res.status(200).json({ lesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}    



module.exports = { getCourses , getLessons };

