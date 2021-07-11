const express = require('express');
const app = express();
const router = express.Router()
const User = require("../schemas/UserSchema")
const bcrypt = require("bcrypt")

var bodyParser = require('body-parser')

router.get("/:id", (req, res, next) => {
    var payload = {
        pageTitle: 'View Post',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }
    res.status(200).render('postPage', payload)
});

module.exports = router