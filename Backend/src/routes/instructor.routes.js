const express = require('express');
const router = express.Router();
const multer = require('multer')

const authMiddleware = require("../middleware/auth.middlware");
const instructorController = require("../controllers/instructor.controller");

const upload = multer({storage: multer.memoryStorage()})

router.post("/register",instructorController.instructorRegister);
router.post('/upload', authMiddleware.authInstructor,upload.single('image'), instructorController.uploadCourse);
router.get("/courses",authMiddleware.authInstructor,instructorController.getInstructorCourses);


module.exports = router;