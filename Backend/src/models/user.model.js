const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    email : {
        type : String,
        required : true,
        trim : true,
        regex : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please fill a valid email address"]
    },
    password : {
        type : String,
        required : true,
        minLength : [6,"Password must be at least 6 characters long"],
        select : false
    },
    role : {
        type : String,
        enum : ["user","admin","instructor"],
        default : "user"
    }
})

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return
    }

    const hash = await bcrypt.hash(this.password,10)
    this.password = hash;

    return 
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("User",userSchema);

module.exports = userModel

