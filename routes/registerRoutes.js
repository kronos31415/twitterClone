const express = require('express')
const app = express();
const router = express.Router()
const User = require("../schemas/UserSchema")

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug')
app.set('views', 'views')

router.get("/", (req, res, next) => {
    res.status(200).render('register')
});

router.post("/", async(req, res, next) => {
    var firstName = req.body.firstName.trim()
    var lastName = req.body.lastName.trim()
    var userName = req.body.userName.trim()
    var email = req.body.email.trim()
    var password = req.body.password

    var payLoad = req.body
    if (firstName && lastName && userName && email && password) {
        var user = await User.findOne({
                $or: [
                    { userName: userName },
                    { email: email }
                ]
            })
            .catch((error) => {
                console.log(error)
                payLoad.errorMessage = "Something went wrong."
                res.status(200).render('register', payLoad)
            })

        if (user == null) {
            // not found ok
        } else {
            if (email == user.email) {
                payLoad.errorMessage = "Email already taken"
            } else {
                payLoad.errorMessage = "Username already taken"
            }
            res.status(200).render('register', payLoad)
        }

    } else {
        payLoad.errorMessage = "Make sure all fields are valid"
        res.status(200).render('register', payLoad)
    }
});

module.exports = router