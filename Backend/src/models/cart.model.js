const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
{
    learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }]
},
{
    timestamps: true
});

cartModel= mongoose.model("Cart", cartSchema);

module.exports = cartModel;