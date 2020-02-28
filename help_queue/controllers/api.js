let express = require("express")
let router = express.Router()
let User = require("../models/User.js")
let Cookies = require("cookies")
let crypto = require("crypto")

let realm = "IT210 Help Queue"

// loggedInUsers
/*
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
*/
// helpUsers
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

// passoffUsers
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
    admin: user.admin,
  }
}

function digestMessage(message) {
  return crypto.createHash("sha256").update(message).digest("hex")
}

User.findOne({username: "mikee314"})
console.log("???")

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

function validateToken(req) {
  return req.session.authorized || false
}

function generateSalt() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

let salts_c = {}

// salt_c
router.get("/user/salt_c/:username", async (req, res) => {
  let username = req.params.username
  let _user = await getUser(username)
  if (_user) {
    res.send(_user.salt_c)
    return
  }
  let salt_c = salts_c[username]
  if (!salt_c) {
    salt_c = generateSalt()
    salts_c[username] = salt_c
  }
  res.send(salt_c)
})

// salt_s
router.get("/user/salt_s/:username", async (req, res) => {
  let username = req.params.username
  let _user = await getUser(username)
  if (!_user) {
    res.sendStatus(500)
    return
  }
  res.send(_user.salt_s)
})

nonces = {}

// nonce
router.get("/user/nonce/:username", async (req, res) => {
  let username = req.params.username
  let nonce = generateSalt()
  nonces[username] = nonce
  res.send(nonce)
})

// Register
router.post("/user/register", async (req, res) => {
  let username = req.body.username
  let firstname = req.body.firstname
  let lastname = req.body.lastname
  let c_salted_password = req.body.c_salted_password
  let c_salted_password_confirm = req.body.c_salted_password_confirm
  let salt_c = salts_c[username]
  if (!salt_c) {
    res.sendStatus(521)
    return
  }
  if (req.body.c_salted_password !== req.body.c_salted_password_confirm) {
    res.sendStatus(522)
    return
  }
  let salt_s = generateSalt()
  let s_salted_password = digestMessage(c_salted_password + salt_s)
  let user = new User({
    username: username,
    firstname: firstname,
    lastname: lastname,
    s_salted_password: s_salted_password,
    salt_c: salt_c,
    salt_s: salt_s,
    admin: false
  })
  try {
    await user.save()
    // GOOD!
    req.session.authorized = true
    req.session.username = user.username
    req.session.firstname = user.firstname
    req.session.lastname = user.lastname
    req.session.admin = false
    // loggedInUsers.push(username)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(524)
  }
})

// Login
router.put("/user/login", async (req, res) => {
  let username = req.body.username
  let _user = await getUser(username)
  if (!_user) {
    res.sendStatus(403)
    return
  }
  let hc = req.body.hc
  let nonce = nonces[username]
  if (!nonce) {
    res.sendStatus(200)
    return
  }
  let hs = digestMessage(_user.username + realm + _user.s_salted_password + nonce)
  if (hc !== hs) {
    res.sendStatus(403)
    return
  }
  // GOOD!
  req.session.authorized = true
  req.session.username = _user.username
  req.session.firstname = _user.firstname
  req.session.lastname = _user.lastname
  req.session.admin = _user.admin
  // loggedInUsers.push(getSmallUser(req.session))
  res.sendStatus(200)
})

// Check Token
router.get("/user/check_token", async (req, res) => {
  if (validateToken(req)) {
    res.sendStatus(200)
    return
  }
  res.sendStatus(401)
})

// Get Username
router.get("/user/get_username", async (req, res) => {
  if (validateToken(req)) {
    res.send(req.session.username)
    return
  }
  res.sendStatus(401)
})


// make good token
/*
router.get("/user/token/cheat", async (req, res) => {
  req.session.authorized = true
  res.sendStatus(200)
})
*/


// Logout              | put  | /user/logout
router.put("/user/logout", async (req, res) => {
  if (validateToken(req)) {
    req.session.authorized = false
    // let username = req.session.username
    res.sendStatus(200)
    // loggedInUsers = loggedInUsers.filter(item => item.username !== username)
    return
  }
  res.sendStatus(401)
})

// Add to help         | put  | /help/add
router.put("/help/add", async (req, res) => {
  if (!validateToken(req)) {
    res.sendStatus(401)
    return
  }
  let username = req.session.username
  if (passoffUsers.some(item => item.username === username)) {
    res.sendStatus(500)
    return
  }
  if (helpUsers.some(item => item.username === username)) {
    res.sendStatus(500)
    return
  }
  helpUsers.push(getSmallUser(req.session))
  res.sendStatus(200)
  return
})

// Remove from help    | put  | /help/remove
router.put("/help/remove", async (req, res) => {
  if (!validateToken(req)) {
    res.sendStatus(401)
    return
  }
  let username = req.session.username
  helpUsers = helpUsers.filter(item => item.username !== username)
  res.sendStatus(200)
})

// Remove from help as admin | put | /help/admin/remove/:u_username
router.put("/help/admin/remove/:u_username", async (req, res) => {
  if (!validateToken(req)) {
    res.sendStatus(401)
    return
  }
  if (!req.session.admin) {
    res.sendStatus(403)
    return
  }
  let u_username = req.params.u_username
  helpUsers = helpUsers.filter(item => item.username !== u_username)
  res.sendStatus(200)
})

// Get help list       | get  | /help
router.get("/help/", async (req, res) => {
  res.send(JSON.stringify(helpUsers))
})

// Add to passoff         | put  | /passoff/add
router.put("/passoff/add", async (req, res) => {
  if (!validateToken(req)) {
    res.sendStatus(401)
    return
  }
  let username = req.session.username
  if (passoffUsers.some(item => item.username === username)) {
    res.sendStatus(500)
    return
  }
  if (helpUsers.some(item => item.username === username)) {
    res.sendStatus(500)
    return
  }
  passoffUsers.push(getSmallUser(req.session))
  res.sendStatus(200)
})

// Remove from passoff    | put  | /passoff/remove
router.put("/passoff/remove", async (req, res) => {
  if (!validateToken(req)) {
    res.sendStatus(401)
    return
  }
  let username = req.session.username
  passoffUsers = passoffUsers.filter(item => item.username !== username)
  res.sendStatus(200)
})

// Remove from passoff as admin | put | /passoff/admin/remove/:u_username
router.put("/passoff/admin/remove/:u_username", async (req, res) => {
  if (!validateToken(req)) {
    res.sendStatus(401)
    return
  }
  if (!req.session.admin) {
    res.sendStatus(403)
    return
  }
  let u_username = req.params.u_username
  passoffUsers = passoffUsers.filter(item => item.username !== u_username)
  res.sendStatus(200)
})

// Get passoff list       | get  | /passoff
router.get("/passoff/", async (req, res) => {
  res.send(JSON.stringify(passoffUsers))
})

module.exports = router
