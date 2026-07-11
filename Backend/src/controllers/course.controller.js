const courseModel = require('../models/course.model');

async function getCourses(req, res) {
    try {
        const courses = await courseModel.find().populate('instructor', 'name');
        res.status(200).json({ courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


module.exports = { getCourses };

