import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        index: true
    },
    avatar: {
        type: String,
        required: true
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.getRefreshToken = function () {
    return jwt.sign({
        "_id": this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1m' }
    )
}

userSchema.methods.getAccessToken = function () {
    return jwt.sign({
        "_id": this._id,
        "email": this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    )
}

export const User = mongoose.model("User", userSchema)
