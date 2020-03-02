// models/User.js

let db = require("../db_connector")

class User {
  constructor(data) {
    this.username = data.username
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.s_salted_password = data.s_salted_password
    this.salt_c = data.salt_c
    this.salt_s = data.salt_s
    this.admin = data.admin
  }
  async save() {
    let sql = "INSERT INTO `Users` SET ?"
    let query = new Promise((resolve, reject) => {
      db.query(sql, this, (err, res, fields) => {
        if (err) throw err
        console.log(res)
        resolve(res)
      })
    })
    return await query.then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

User.findOne = (data) => {
  let sql = "SELECT * FROM `Users` WHERE ?"
  let query = new Promise((resolve, reject) => {
    db.query(sql, data, (err, res, fields) => {
      if (err) throw err
      resolve(res[0])
    })
  })
  return query
}

// let userSchema = new db.Schema({
//   username: String,
//   firstname: String,
//   lastname: String,
//   s_salted_password: String,
//   salt_c: String,
//   salt_s: String,
//   admin: Boolean,
// })

// sizzledashviewlessoversweet

// let User = db.model("User", userSchema)
// User.isValid = (body) => {
//   if (!body.username) {
//     return false
//   }
//   if (!body.firstname) {
//     return false
//   }
//   if (!body.lastname) {
//     return false
//   }
//   if (!body.password) {
//     return false
//   }
//   return true
// }

module.exports = User

// module.exports.User = db.model("User", userSchema)
