const express = require('express');
const app = express();
const router = express.Router()
const User = require("../schemas/UserSchema")
const bcrypt = require("bcrypt")

var bodyParser = require('body-parser')

router.get("/", (req, res, next) => {
    var payload = {
        pageTitle: req.session.user.userName,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUSer: req.session.userd
    }
    res.status(200).render('profilePage', payload)
});

module.exports = router