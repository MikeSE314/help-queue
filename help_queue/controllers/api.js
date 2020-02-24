const express = require("express")
const router = express.Router()
const User = require("../models/User.js")
const Cookies = require("cookies")

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

function getSmallUser(user) {
  return {
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
  }
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
    loggedInUsers.push(username)
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
  if (_user.password === password) {
    res.send(JSON.stringify(_user))
    loggedInUsers.push(username)
  }
  res.sendStatus(401)
  return
})

// Logout              | put  | /user/logout
router.put('/user/logout', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let _user = await getUser(username)
  // if (await checkPassword(username, password)) {
  if (_user.password === password) {
    res.sendStatus(200)
    loggedInUsers = loggedInUsers.filter(item => item.username !== username)
    return
  }
  res.sendStatus(401)
})

// Add to help         | put  | /help/add
router.put('/help/add', async (req, res) => {
  let username = req.body.username
  if (helpUsers.some(item => item.username === username)) {
    res.sendStatus(500)
  }
  let password = req.body.password
  let _user = await getUser(username)
  if (_user.password === password) {
  // if (await checkPassword(username, password)) {
    helpUsers.push(getSmallUser(_user))
    res.send(getSmallUser(_user))
    return
  }
  res.sendStatus(401)
})

// Remove from help    | put  | /help/remove
router.put('/help/remove', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let _user = await getUser(username)
  // if (await checkPassword(username, password)) {
  if (_user.password === password) {
    res.sendStatus(200)
    helpUsers = helpUsers.filter(item => item.username !== username)
    return
  }
  res.sendStatus(401)
})

// Remove from help as admin | put | /help/admin/remove/:u_username
router.put("/help/admin/remove/:u_username", async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let u_username = req.params.u_username
  let _user = await getUser(username)
  if (_user.password === password && _user.admin) {
    helpUsers = helpUsers.filter(item => item.username !== u_username)
    res.send(helpUsers)
    return
  }
  res.sendStatus(401)
})

// Get help list       | get  | /help
router.get('/help/', async (req, res) => {
  res.send(JSON.stringify(helpUsers))
})

// Add to passoff         | put  | /passoff/add
router.put('/passoff/add', async (req, res) => {
  let username = req.body.username
  if (passoffUsers.some(item => item.username === username)) {
    res.sendStatus(500)
  }
  let password = req.body.password
  let _user = await getUser(username)
  if (_user.password === password) {
    passoffUsers.push(getSmallUser(_user))
    res.send(getSmallUser(_user))
    return
  }
  res.sendStatus(401)
})

// Remove from passoff    | put  | /passoff/remove
router.put('/passoff/remove', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let _user = await getUser(username)
  if (_user.password === password) {
  // if (await checkPassword(username, password)) {
    res.sendStatus(200)
    passoffUsers = passoffUsers.filter(item => item.username !== username)
    return
  }
  res.sendStatus(401)
})

// Remove from passoff as admin | put | /passoff/admin/remove/:u_username
router.put("/passoff/admin/remove/:u_username", async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let u_username = req.params.u_username
  let _user = await getUser(username)
  if (_user.password === password && _user.admin) {
    console.log(passoffUsers)
    console.log(u_username)
    passoffUsers = passoffUsers.filter(item => item.username !== u_username)
    console.log(passoffUsers)
    res.send(passoffUsers)
    return
  }
  res.sendStatus(401)
})

// Get passoff list       | get  | /passoff
router.get('/passoff/', async (req, res) => {
  res.send(JSON.stringify(passoffUsers))
})

module.exports = router
