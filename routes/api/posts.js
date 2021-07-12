const express = require('express');
const app = express();
const router = express.Router()
const User = require("../../schemas/UserSchema")
const Post = require("../../schemas/PostSchema")

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async(req, res, next) => {
    var posts = await getPosts({});
    return res.status(200).send(posts)
});

router.get("/:id", async(req, res, next) => {
    var postId = req.params.id
    var postData = await getPosts({ _id: postId })
    postData = postData[0]
    var results = {
        postData: postData
    }
    if (postData.replayTo !== undefined) {
        results.replayTo = postData.replayTo
    }
    results.replies = await getPosts({ replayTo: postId })
    return res.status(200).send(results)

});

router.delete("/:id", async(req, res, next) => {
    var postId = req.params.id
    Post.findByIdAndDelete(postId)
        .then(() => res.sendStatus(202))
        .catch((errors) => {
            console.log(errors)
            res.sendStatus(404)
        })

});

router.post("/", async(req, res, next) => {

    if (!req.body.content) {
        console.log("no content")
        return res.sendStatus(400)
    }

    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    if (req.body.replayTo) {
        postData.replayTo = req.body.replayTo
    }

    Post.create(postData)
        .then(async newPost => {
            newPost = await User.populate(newPost, { path: "postedBy" })

            return res.status(201).send(newPost)
        })
        .catch(error => {
            console.log(error)
            return res.sendStatus(400)
        })
});

router.put("/:id/like", async(req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;
    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId)
    var option = isLiked ? '$pull' : '$addToSet'

    req.session.user = await User.findByIdAndUpdate(userId, {
            [option]: { likes: postId }
        }, { new: true })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

    var post = await Post.findByIdAndUpdate(postId, {
            [option]: { likes: userId }
        }, { new: true })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

    return res.send(post)

});

router.post("/:id/retweet", async(req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;
    var deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

    var option = deletedPost != null ? '$pull' : '$addToSet'

    var repost = deletedPost;

    if (repost == null) {
        repost = await Post.create({ postedBy: userId, retweetData: postId })
    }

    req.session.user = await User.findByIdAndUpdate(userId, {
            [option]: { retweets: repost._id }
        }, { new: true })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

    var post = await Post.findByIdAndUpdate(postId, {
            [option]: { retweetUsers: userId }
        }, { new: true })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

    return res.send(post)

});

async function getPosts(filter) {
    var results = await Post.find(filter)
        .populate('postedBy')
        .populate('retweetData')
        .populate('replayTo')
        .sort({ "createdAt": -1 })
        .catch((errors) => console.log(errors))

    results = await User.populate(results, { path: "replayTo.postedBy" })
    return await User.populate(results, { path: "retweetData.postedBy" })
}

module.exports = router