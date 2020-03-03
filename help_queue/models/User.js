// models/User.js

var db = require("../db_connector")

let userSchema = new db.Schema({
  netid: String,
  firstname: String,
  lastname: String,
}, {
  collection: "students"
})

// sizzledashviewlessoversweet

let User = db.model("User", userSchema)

module.exports = User

// module.exports.User = db.model("User", userSchema)
