let mongoose = require("mongoose")

require('dotenv').config();

let password = process.env.DB_PW || ""

let url = "mongodb+srv://db_user:" + password + "@help-queue-p0xtr.mongodb.net/help_queue?retryWrites=true&w=majority"

mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    if(err) console.error(err)
})

module.exports = mongoose
