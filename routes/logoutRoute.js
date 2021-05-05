const express = require('express');
const app = express();
const router = express.Router()
const User = require("../schemas/UserSchema")
const bcrypt = require("bcrypt")

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    if (req.session) {
        req.session.destroy(() => {
            return res.redirect("/login")
        })
    }
});

module.exports = router