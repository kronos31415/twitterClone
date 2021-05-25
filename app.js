const express = require('express');
const app = express();
const port = 3001;
const middleware = require('./middleware')
const path = require('path')

bodyParser = require('body-parser')
mongoose = require("./database")
const { mongo } = require('mongoose');

const session = require("express-session");
app.use(session({
    secret: 'pawcio',
    resave: false,
    saveUninitialized: true
}))


app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(port, () => {
    console.log("Serwer listen on port " + port)
});

app.set('view engine', 'pug')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, "public")));

//Routes
const loginRoutes = require('./routes/loginRoutes')
const registerRoutes = require('./routes/registerRoutes');


//Api routes
const postsApiRoute = require('./routes/api/posts')

app.use("/login", loginRoutes)
app.use("/register", registerRoutes)

app.use("/api/posts", postsApiRoute)

const logoutRoutes = require('./routes/logoutRoute');
app.use("/logout", logoutRoutes)

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: 'Home',
        userLoggedIn: req.session.user
    }
    res.render('home', payload)
});