const enrollmentModel = require('../models/enrollment.model');
const cartModel = require('../models/enrollment.model');

async function enrollment(req,res){
    try{
        const cart = await cartModel.findOne({
        learner: req.user._id
        });

        for (const courseId of cart.courses) {

            const alreadyEnrolled = await enrollmentModel.findOne({
                learner: req.user._id,
                course: courseId
            });

            if (!alreadyEnrolled) {
                await enrollmentModel.create({
                    learner: req.user._id,
                    course: courseId,
                    paymentStatus: "completed"
                });
            }
        }

        cart.courses = [];
        await cart.save();
    }catch(err){
        res.status(400).json({ message : "enrollment failed"})
    }
}

async function getMyCourses(req, res) {

    const courses = await enrollmentModel
        .find({
            learner: req.user._id,
            paymentStatus: "completed"
        })
        .populate("course");

    return res.json(courses);
}