const express = require('express')
const router = express.Router()
const User = require("../models/User.js")

let loggedInUsers = []
let helpUsers = []
let passoffUsers = []

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.sendStatus(200)
})

// Register            | post | /user/register
// Login               | put  | /user/login
// Logout              | put  | /user/logout
// Add to help         | put  | /help/add
// Remove from help    | put  | /help/remove
// Get help list       | get  | /help
// Add to passoff      | put  | /passoff/add
// Remove from passoff | put  | /passoff/remove
// Get passoff list    | get  | /passoff

async function checkPassword(username, password) {
  try {
    User.findOne({username: username}, (err, user) => {
      if (err) {
        return false
      }
      if (user.password === password) {
        return true
      }
      return false
    })
  } catch (err) {
    console.error(err)
    return false
  }
}

async function checkAdmin(username, password) {
  try {
    User.findOne({username: username}, (err, user) => {
      if (err) {
        return false
      }
      if (user.password === password) {
        return user.admin
      }
      return false
    })
  } catch (err) {
    console.error(err)
    return false
  }
}

async function getFullName(username) {
  try {
    User.findOne({username: username}, (err, user) => {
      if (err) {
        return false
      }
      return user.firstname + " " + user.lastname
    })
  } catch (err) {
    console.error(err)
    return false
  }
}

// Register
router.post('/user/register', async (req, res) => {
  if (!User.isValid(req.body)) {
    res.sendStatus(500)
    return
  }
  if (req.body.password !== req.body.c_password) {
  }
  let user = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    admin: false
  })
  try {
    user.save()
    res.send(200)
    loggedInUsers.push(user.username)
  } catch (err) {
    res.sendStatus(500)
  }
})

// Login
router.put('/user/login', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    res.sendStatus(200)
    loggedInUsers.push(username)
    return
  }
  res.sendStatus(401)
})

// Logout              | put  | /user/logout
router.put('/user/logout', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    res.sendStatus(200)
    loggedInUsers.filter(item => item !== username)
    return
  }
  res.sendStatus(401)
})

// Add to help         | put  | /help/add
router.put('/help/add', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    res.sendStatus(200)
    helpUsers.push(username)
    return
  }
  res.sendStatus(401)
})

// Remove from help    | put  | /help/remove
router.put('/help/remove', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    res.sendStatus(200)
    helpUsers.filter(item => item !== username)
    return
  }
  res.sendStatus(401)
})

// Get help list       | get  | /help
router.get('/help/', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    // TODO
    res.send(JSON.stringify(helpUsers))
    return
  }
  res.sendStatus(401)
})

// Add to passoff         | put  | /passoff/add
router.put('/passoff/add', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    res.sendStatus(200)
    passoffUsers.push(username)
    return
  }
  res.sendStatus(401)
})

// Remove from passoff    | put  | /passoff/remove
router.put('/passoff/remove', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    res.sendStatus(200)
    passoffUsers.filter(item => item !== username)
    return
  }
  res.sendStatus(401)
})

// Get passoff list       | get  | /passoff
router.get('/passoff/', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    // TODO
    console.log(JSON.stringify(helpUsers.map(item => getFullName(item))))
    res.send(JSON.stringify(helpUsers.map(item => getFullName(item))))
    return
  }
  res.sendStatus(401)
})

module.exports = router
