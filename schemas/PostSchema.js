const mongoose = require("mongoose")

const Schema = mongoose.Schema

const PostSchama = new Schema({
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean
}, { timestamps: true })

const Post = mongoose.model('Post', UserSchama)
module.exports = Post