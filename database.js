const mongoose = require("mongoose")
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://admin:admin@twitterclonecluster.as3fk.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority")
            .then(() => {
                console.log("connection OK")
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

module.exports = new Database();