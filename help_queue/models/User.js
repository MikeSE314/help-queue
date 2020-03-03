// models/User.js

let db = require("../db_connector")

let userSchema = new db.Schema({
  netid: String,
  firstname: String,
  lastname: String,
}, {
  collection: "students"
})

let User = db.model("User", userSchema)

module.exports = User

// module.exports.User = db.model("User", userSchema)
