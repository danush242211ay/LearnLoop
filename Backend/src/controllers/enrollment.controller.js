const cartModel = require('../models/cart.model')


async function addToCart(req, res) {
    const { courseId } = req.params;

    let cart = await cartModel.findOne({
        learner: req.user._id
    });

    if (!cart) {
        cart = await cartModel.create({
            learner: req.user._id,
            courses: [courseId]
        });
    } else {
        // Prevent duplicate courses
        if (cart.courses.includes(courseId)) {
            return res.status(400).json({
                message: "Course already in cart"
            });
        }

        cart.courses.push(courseId);
        await cart.save();
    }

    res.status(201).json({
        message: "Course added to cart",
        cart
    });
}

async function getCartItems(req,res){
    const cart = await cartModel.find({ learner: req.user._id });
    
    res.status(200).json({ cart });
}

async function deleteItems(req, res) {
    const { courseId } = req.params;

    const cart = await cartModel.findOneAndUpdate(
        { learner: req.user._id },
        {
            $pull: {
                courses: courseId
            }
        },
        { new: true }
    );

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found"
        });
    }

    return res.status(200).json({
        message: "Course removed from cart",
        cart
    });
}   

module.exports = { addToCart , getCartItems , deleteItems}