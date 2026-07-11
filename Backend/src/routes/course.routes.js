const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middlware')
const courseController = require('../controllers/course.controller')


router.post('/upload', authMiddleware.authInstructor, courseController.uploadCourse)






module.exports = router


