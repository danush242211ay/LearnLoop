const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/auth.middlware");
const instructorController = require("../controllers/instructor.controller");

router.post("/register",instructorController.instructorRegister);
router.post('/upload', authMiddleware.authInstructor, instructorController.uploadCourse);
router.get("/courses",authMiddleware.authInstructor,instructorController.getInstructorCourses);


module.exports = router;