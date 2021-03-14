const express = require('express')
const app = express()
const port = 3003

const server = app.listen(() => {
    console.log("Serwer listen on port " + port)
})