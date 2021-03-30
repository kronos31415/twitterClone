const express = require('express')
const app = express();
const router = express.Router()

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug')
app.set('views', 'views')

router.get("/", (req, res, next) => {
    res.status(200).render('register')
});

router.post("/", (req, res, next) => {
    console.log(req.body)
    var firstName = req.body.firstName.trim()
    var lastName = req.body.lastName.trim()
    var userName = req.body.userName.trim()
    var email = req.body.email.trim()
    var password = req.body.password

    var payLoad = req.body
    if (firstName && lastName && userName && email && password) {

    } else {
        payLoad.errorMessage = "Make sure all fields are valid"
        res.status(200).render('register', payLoad)
    }
});

module.exports = router