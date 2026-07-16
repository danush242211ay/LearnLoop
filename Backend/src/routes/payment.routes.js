const express = require('express')
const router = express.Router()

const paymentController = require('../controllers/payment.controller')

router.post('/createorder',paymentController.createOrder)
router.post('/verifyorder',paymentController.verifyOrder)

module.exports = router

