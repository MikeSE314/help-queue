let express = require("express")
let router = express.Router()
let User = require("../models/User.js")

let nonce

let helpUsers = [
  {
    netid: "a",
    firstname: "No",
    lastname: "admin"
  },
]

// passoffUsers
let passoffUsers = [
  {
    netid: "b",
    firstname: "No",
    lastname: "admin"
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

async function getUser(netid) {
  return await User.findOne({netid: netid}, (err, user) => {
    if (err) throw err
    return user
  })
}

function getSmallUser(user) {
  return {
    netid: user.netid,
    firstname: user.firstname,
    lastname: user.lastname,
  }
}

function makeNonce() {
  nonce = process.env.ADMIN_SECRET || Math.random().toString(36).substring(2, 6)
  console.info(`Admin passphrase: ${nonce}`)
}

makeNonce()

// nonce
router.get("/admin/nonce", async (req, res) => {
  makeNonce()
  res.sendStatus(200)
})

// Login
router.put("/admin/login", async (req, res) => {
  let u_nonce = req.body.nonce
  if (!u_nonce) {
    res.sendStatus(401)
    return
  }
  if (nonce !== u_nonce) {
    makeNonce()
    res.sendStatus(403)
    return
  }
  makeNonce()
  req.session.authorized = true
  res.sendStatus(200)
})

router.get("/admin/test", async (req, res) => {
  if (req.session.authorized) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

// Logout              | put  | /user/logout
router.put("/admin/logout", async (req, res) => {
  if (req.session.authorized === true) {
    req.session.authorized = false
    // let netid = req.session.netid
    res.sendStatus(200)
    return
  }
  res.sendStatus(401)
})

router.get("/user/:netid", async (req, res) => {
  let netid = req.params.netid
  let user = await getUser(netid)
  if (user) {
    res.send(user)
    return
  }
  console.info(`${netid} failed`)
  res.sendStatus(500)
})

// Add to help         | put  | /help/add
router.put("/help/add", async (req, res) => {
  let netid = req.body.netid
  if (passoffUsers.some(item => item.netid === netid)) {
    res.sendStatus(500)
    return
  }
  if (helpUsers.some(item => item.netid === netid)) {
    res.sendStatus(500)
    return
  }
  helpUsers.push(getSmallUser(req.body))
  res.sendStatus(200)
  return
})

// Add to passoff         | put  | /passoff/add
router.put("/passoff/add", async (req, res) => {
  let netid = req.body.netid
  if (passoffUsers.some(item => item.netid === netid)) {
    res.sendStatus(500)
    return
  }
  if (helpUsers.some(item => item.netid === netid)) {
    res.sendStatus(500)
    return
  }
  passoffUsers.push(getSmallUser(req.body))
  res.sendStatus(200)
})

// Remove from help    | put  | /help/remove
router.get("/help/remove/:netid", async (req, res) => {
  let netid = req.params.netid
  helpUsers = helpUsers.filter(item => item.netid !== netid)
  res.sendStatus(200)
})

// Remove from passoff    | put  | /passoff/remove
router.get("/passoff/remove/:netid", async (req, res) => {
  let netid = req.params.netid
  passoffUsers = passoffUsers.filter(item => item.netid !== netid)
  res.sendStatus(200)
})

// Remove from help    | put  | /help/remove
router.put("/help/admin/remove", async (req, res) => {
  let netid = req.body.netid
  helpUsers = helpUsers.filter(item => item.netid !== netid)
  res.sendStatus(200)
})

// Remove from passoff    | put  | /passoff/remove
router.put("/passoff/admin/remove", async (req, res) => {
  let netid = req.body.netid
  passoffUsers = passoffUsers.filter(item => item.netid !== netid)
  res.sendStatus(200)
})

// Get help list       | get  | /help
router.get("/help", async (req, res) => {
  res.send(JSON.stringify(helpUsers))
})

// Get passoff list       | get  | /passoff
router.get("/passoff/", async (req, res) => {
  res.send(JSON.stringify(passoffUsers))
})

module.exports = router
