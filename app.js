const express = require('express');
var http = require('http');
const app = express();
const port = 3001;

app.set('view engine', 'pug')
app.set('views', 'views')

const server = app.listen(port, () => {
    console.log("Serwer listen on port " + port)
});

app.get("/", (req, res, next) => {
    res.render('home')
});