const userModel = require('../models/user.model');
const courseModel = require('../models/course.model');


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

module.exports = { uploadCourse };

