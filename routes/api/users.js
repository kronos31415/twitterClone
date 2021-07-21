const express = require('express');
const app = express();
const router = express.Router()
const User = require("../../schemas/UserSchema")
const Post = require("../../schemas/PostSchema")

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

router.put("/:userId/follow", async(req, res, next) => {
    res.status(200).send("bangala")
});

module.exports = router