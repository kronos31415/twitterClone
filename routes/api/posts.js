const express = require('express');
const app = express();
const router = express.Router()
const User = require("../../schemas/UserSchema")
const Post = require("../../schemas/PostSchema")

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    Post.find()
        .populate('postedBy')
        .then((results) => res.status(200).send(results))
        .catch((errors) => {
            res.sendStatus(400)
            console.log(errors)
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

module.exports = router