const express = require('express');
const app = express();
const router = express.Router()
const User = require("../schemas/UserSchema")
const bcrypt = require("bcrypt")

var bodyParser = require('body-parser')

router.get("/", (req, res, next) => {
    console.log(req.session.user)
    var user = req.session.user
    var payload = {
        pageTitle: user.userName,
        userLoggedIn: user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: user
    }
    res.status(200).render('profilePage', payload)
});

router.get("/:username", async(req, res, next) => {
    var payload = await getPayload(req.params.username, req.session.user)
    res.status(200).render('profilePage', payload)
});

router.get("/:username/replies", async(req, res, next) => {
    var payload = await getPayload(req.params.username, req.session.user)
    payload.selectedTab = 'replies'
    res.status(200).render('profilePage', payload)
});

async function getPayload(username, userLoggedIn) {
    var user = await User.findOne({ userName: username })
    if (user == null) {
        user = await User.findById({ username })
        if (user == null) {
            return {
                pageTitle: "User not found",
                userLoggedIn: userLoggedIn,
                userLoggedInJs: JSON.stringify(userLoggedIn),
            }
        }

    }
    return {
        pageTitle: user.userName,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}

module.exports = router