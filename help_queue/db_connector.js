let mysql = require("mysql")

require('dotenv').config();

let password = process.env.DB_PW || ""

console.log("using password " + password)

mongoose.connect("mongodb+srv://db_user:" + password + "@help-queue-p0xtr.mongodb.net/help_queue?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true})

module.exports = connection



// let mongoose = require("mongoose")

// mongoose.connect("mongodb://127.0.0.1:27017/help_queue", {useUnifiedTopology: true, useNewUrlParser: true})

// module.exports = mongoose
