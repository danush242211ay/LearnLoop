const express = require('express');

const router = express.Router()
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middlware')

router.post('/addcart/:courseId',authMiddleware.authUser ,cartController.addToCart)
router.get('/cart',authMiddleware.authUser, cartController.getCartItems)
router.delete('/deleteitems/:courseId',authMiddleware.authUser ,cartController.deleteItems)
router.delete('/deleteallitems',authMiddleware.authUser ,cartController.deleteAllItems)


module.exports = router