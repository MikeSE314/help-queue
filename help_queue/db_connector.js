let mongoose = require("mongoose")

mongoose.connect("mongodb+srv://db_user:8mnjhnm48d5dw62hnb5j@help-queue-p0xtr.mongodb.net/help_queue?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true})

module.exports = mongoose
