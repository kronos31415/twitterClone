const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchama = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "/images/profilePic.png" }
}, { timestamps: true })

const User = mongoose.model('User', UserSchama)
module.exports = User