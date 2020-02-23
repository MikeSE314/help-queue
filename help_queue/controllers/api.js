const express = require('express')
const router = express.Router()
const User = require("../models/User.js")

let loggedInUsers = [
  {
    username: "alice",
  },
  {
    username: "bob",
  },
  {
    username: "chuck",
  },
  {
    username: "dan",
  },
  {
    username: "earl",
  },
  {
    username: "frank",
  },
  {
    username: "greg",
  },
]
let helpUsers = [
  {
    username: "alice",
    firstname: "Alice",
    lastname: "Averette"
  },
  {
    username: "bob",
    firstname: "Robert",
    lastname: "Benson"
  },
  {
    username: "chuck",
    firstname: "Charles",
    lastname: "Clinton"
  },
  {
    username: "dan",
    firstname: "Daniel",
    lastname: "Davies"
  },
]
let passoffUsers = [
  {
    username: "earl",
    firstname: "Earl",
    lastname: "Earnest"
  },
  {
    username: "frank",
    firstname: "Frankie",
    lastname: "Fillandery"
  },
  {
    username: "greg",
    firstname: "Gregory",
    lastname: "Gregson"
  },
]

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
        console.error(err)
        return false
      }
      if (!user) {
        return false
      }
      console.log(password)
      console.log(user.password)
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

function getFullName(user) {
  return user.firstname + " " + user.lastname
}

async function getUser(username) {
  try {
    return await User.findOne({username: username}, (err, user) => {
      if (err) {
        console.error(err)
        return false
      }
      if (user === {} || user === null) {
        return false
      }
      return user
    })
  } catch (err) {
    console.error(err)
    return false
  }
}

// Register
router.post('/user/register', async (req, res) => {
  let username = req.body.username
  if (!User.isValid(req.body)) {
    res.sendStatus(501)
    return
  }
  if (req.body.password !== req.body.c_password) {
    res.sendStatus(502)
    return
  }
  let _user = await getUser(username)
  if (_user) {
    res.sendStatus(503)
    return
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
    res.sendStatus(200)
    loggedInUsers.push(user.username)
  } catch (err) {
    res.sendStatus(504)
  }
})

// Login
router.put('/user/login', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  console.log(username)
  let _user = await getUser(username)
  console.log(_user)
  if (!_user) {
    console.log("no such user")
    res.sendStatus(401)
    return
  }
  if (_user.password !== password) {
    console.log("passwords don't match")
    res.sendStatus(401)
    return
  }
  res.sendStatus(200)
  loggedInUsers.push(username)
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
    res.send(JSON.stringify(helpUsers.map(item => getFullName(item))))
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
    res.send(JSON.stringify(passoffUsers.map(item => getFullName(item))))
    return
  }
  res.sendStatus(401)
})

module.exports = router
