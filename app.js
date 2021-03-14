const express = require('express');
const app = express();
const port = 3001;
const middleware = require('./middleware')

const server = app.listen(port, () => {
    console.log("Serwer listen on port " + port)
});

app.set('view engine', 'pug')
app.set('views', 'views')

//Routes
const loginRoutes = require('./routes/loginRoutes')
app.use("/login", loginRoutes)

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        title: 'Welocme'
    }
    res.render('home', payload)
});