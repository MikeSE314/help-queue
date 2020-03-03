let mongoose = require("mongoose")

require('dotenv').config();

let password = process.env.DB_PW || ""

console.log("using password " + password)

let url = "mongodb+srv://db_user:" + password + "@help-queue-p0xtr.mongodb.net/help_queue?retryWrites=true&w=majority"

console.log(`connecting to ${url} . . .`)
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    if(err) console.error(err)
    console.log("connection successful")
})

module.exports = mongoose
