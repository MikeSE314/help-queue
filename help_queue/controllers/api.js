const express = require("express")
const router = express.Router()
const User = require("../models/User.js")
const Cookies = require("cookies")

let loggedInUsers = {
  users: [
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
}

let helpUsers = {
  users: [
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
}

let passoffUsers = {
  users: [
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
}

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
    res.sendStatus(521)
    return
  }
  if (req.body.password !== req.body.c_password) {
    res.sendStatus(522)
    return
  }
  // let _user = await getUser(username)
  // if (_user) {
    // res.sendStatus(523)
    // return
  // }
  let user = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    admin: false
  })
  try {
    await user.save()
    loggedInUsers.users.push(user.username)
    res.send(JSON.stringify(user))
  } catch (err) {
    console.error(err)
    res.sendStatus(524)
  }
})

// Login
router.put('/user/login', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let _user = await getUser(username)
  if (!_user) {
    res.sendStatus(401)
    return
  }
  if (_user.password !== password) {
    res.sendStatus(401)
    return
  }
  res.send(JSON.stringify(_user))
  loggedInUsers.users.push(username)
})

// Logout              | put  | /user/logout
router.put('/user/logout', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    res.sendStatus(200)
    loggedInUsers.users.filter(item => item !== username)
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
    helpUsers.users.push(username)
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
    helpUsers.users.filter(item => item !== username)
    return
  }
  res.sendStatus(401)
})

// Get help list       | get  | /help
router.get('/help/', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
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
    passoffUsers.users.push(username)
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
    passoffUsers.users.filter(item => item !== username)
    return
  }
  res.sendStatus(401)
})

// Get passoff list       | get  | /passoff
router.get('/passoff/', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (checkPassword(username, password)) {
    res.send(JSON.stringify(passoffUsers))
    return
  }
  res.sendStatus(401)
})

module.exports = router
