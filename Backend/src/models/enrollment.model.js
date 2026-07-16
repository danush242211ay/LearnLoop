const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
{
    learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "completed"]
    },

    enrolledAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

// Prevent duplicate enrollment
enrollmentSchema.index(
    { learner: 1, course: 1 },
    { unique: true }
);

enrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

module.exports = enrollmentModel