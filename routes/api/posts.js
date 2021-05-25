const express = require('express');
const app = express();
const router = express.Router()
const User = require("../../schemas/UserSchema")

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {

});

router.post("/", async(req, res, next) => {
    if (!req.body.content) {
        console.log("no content")
        return res.sendStatus(400)
    }
    res.status(200).send('it work')
});

module.exports = router