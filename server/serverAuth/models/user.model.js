const { Schema, model } = require("mongoose");
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const UserName = new Schema({
    firstName: {
        type: String,
        trim: true,
        // required: [true, "Hero name is required"]
    },
    lastName: {
        type: String,
    },
    userId: {
        type: Number,
    },
    email: {
        type: String,
        required: [true, 'Please provider email'],
        unique: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male'
    }
    ,
    age : {
        type : Number
    },
    password: {
        type: String,
        // required: [true,'Please provider password'],
        minlength: 6,
        select: false,
    },
    passwordConfirm: {
        type: String,
        // required: [true, 'Please confirm your password'],
        select: false,
    },
},

    {
        timestamp: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })


UserName.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcryptjs.compare(candidatePassword, this.password);
    return isMatch
}
UserName.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET , { expiresIn: "90d" })
};

UserName.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})
UserName.pre('save', async function (req, res, next) {
    if (!this.isModified('password')) return
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    // this.passwordConfirm = await bcryptjs.hash(this.passwordConfirm, salt);

})

const User = mongoose.model('User', UserName)
module.exports = User