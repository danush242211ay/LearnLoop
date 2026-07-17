const express = require('express')
const router = express.Router()

const paymentController = require('../controllers/payment.controller')
const authMiddleware = require('../middleware/auth.middlware')

router.post('/createorder',authMiddleware.authUser,paymentController.createOrder)
router.post('/verifyorder',authMiddleware.authUser,paymentController.verifyOrder)

module.exports = router

