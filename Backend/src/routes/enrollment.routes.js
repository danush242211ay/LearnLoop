const express = require('express');

const router = express.Router()
const enrollmentController = require('../controllers/enrollment.controller');
const authMiddleware = require('../middleware/auth.middlware')

router.post('/addcart/:courseId',authMiddleware.authUser,enrollmentController.addToCart)
router.get('/cart',authMiddleware.authUser,enrollmentController.getCartItems)




module.exports = router