const express = require('express');
const app = express();
const router = express.Router()
const User = require("../schemas/UserSchema")
const bcrypt = require("bcrypt")

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug')
app.set('views', 'views')

router.get("/", (req, res, next) => {
    res.status(200).render('login')
});

router.post("/", async(req, res, next) => {
    var payLoad = req.body

    if (req.body.logUserName && req.body.logPassword) {
        var user = await User.findOne({
                $or: [
                    { userName: req.body.logUserName },
                    { password: req.body.logPassword }
                ]
            })
            .catch((error) => {
                console.log(error)
                payLoad.errorMessage = "Something went wrong."
                res.status(200).render('login', payLoad)
            })

        if (user != null) {
            var result = await bcrypt.compare(req.body.logPassword, user.password)
            if (result === true) {
                console.log(result)
                req.session.user = user;
                return res.redirect("/")
            } else {
                console.log(result)
                payLoad.errorMessage = "Login credentials incorect"
                return res.status(200).render('login', payLoad)
            }
        }
    }
    payload.errorMessage = "Make sure each field has value"
    res.status(200).render('login', payLoad)
});

module.exports = router