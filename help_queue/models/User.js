// models/User.js

var db = require("../db_connector")

let userSchema = new db.Schema({
  username: String,
  firstname: String,
  lastname: String,
  password: String,
  admin: Boolean,
})

let User = db.model("User", userSchema)
User.isValid = (body) => {
  if (!body.username) {
    return false
  }
  if (!body.firstname) {
    return false
  }
  if (!body.lastname) {
    return false
  }
  if (!body.password) {
    return false
  }
  return true
}

module.exports = User

// module.exports.User = db.model("User", userSchema)
