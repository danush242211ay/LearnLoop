const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    videoUrl: {
        type: String,
        required: true
    },

    duration: {
        type: Number, // Duration in seconds
        default: 0
    },

    order: {
        type: Number,
        required: true,
        unique: true
    },

    isPreview: {
        type: Boolean,
        default: false
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }
},
{
    timestamps: true
});

lessonModel= mongoose.model("Lesson", lessonSchema);

module.exports = lessonModel;