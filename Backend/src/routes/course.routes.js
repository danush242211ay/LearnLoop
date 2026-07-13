const express = require('express')
const router = express.Router()

const courseController = require('../controllers/course.controller')
const authMiddleware = require("../middleware/auth.middlware");

router.get("/",courseController.getCourses)

router.get("/lessons/:courseId",authMiddleware.authUser ,courseController.getLessons)





module.exports = router


