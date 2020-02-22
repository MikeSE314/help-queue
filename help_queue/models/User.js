// models/users.js

var db = require("../db_connector")

let userSchema = new db.Schema({
  username: String,
  firstname: String,
  lastname: String,
  password: String,
  admin: Boolean,
})

let User = db.model("User", userSchema)

module.exports = User
