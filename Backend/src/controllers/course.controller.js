const courseModel = require('../models/course.model');
const lessonModel = require('../models/lesson.model');
const enrollmentModel = require('../models/enrollment.model')

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
    const { courseId } = req.params;

    try {

        // Check if the user has purchased the course
        const enrollment = await enrollmentModel.findOne({
            learner: req.user._id,
            course: courseId,
            paymentStatus: "completed"
        });

        let lessons;

        if (enrollment) {
            // Purchased user -> return all lessons
            lessons = await lessonModel.find({ course: courseId }).sort({ order: 1 });
        } else {
            // Not purchased -> return only preview lessons
            lessons = await lessonModel.find({
                course: courseId,
                isPreview: true
            }).sort({ order: 1 });
        }

        return res.status(200).json({
            success: true,
            lessons
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}    



module.exports = { getCourses , getLessons };

