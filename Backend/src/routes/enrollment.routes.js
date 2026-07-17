const express = require('express');
const router = express.Router();

const enrollmentController = require('../controllers/enrollment.controller');
const authMiddleware = require('../middleware/auth.middlware');

// Enroll the learner in whatever is currently in their cart.
// Call this right after payment.verifyOrder succeeds.
router.post('/enroll', authMiddleware.authUser, enrollmentController.enrollment);

// Everything the learner has successfully paid for and can now watch.
router.get('/mycourses', authMiddleware.authUser, enrollmentController.getMyCourses);

module.exports = router;
