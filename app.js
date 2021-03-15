const express = require('express');
const app = express();
const port = 3001;
const middleware = require('./middleware')
const path = require('path')

const server = app.listen(port, () => {
    console.log("Serwer listen on port " + port)
});

app.set('view engine', 'pug')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, "public")));

//Routes
const loginRoutes = require('./routes/loginRoutes')
app.use("/login", loginRoutes)

const registerRoutes = require('./routes/registerRoutes')
app.use("/register", registerRoutes)

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        title: 'Welocme'
    }
    res.render('home', payload)
});