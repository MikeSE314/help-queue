// models/User.js

var db = require("../db_connector")

let userSchema = new db.Schema({
  username: String,
  firstname: String,
  lastname: String,
  s_salted_password: String,
  salt_c: String,
  salt_s: String,
  admin: Boolean,
})

// sizzledashviewlessoversweet

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
