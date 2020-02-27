const express = require("express")
const router = express.Router()

/* GET home page. */
router.get("/", async (req, res, next) => {
  if (!req.session.authorized) {
    res.redirect("/login")
    return
  }
  res.render("index", {admin: req.session.admin, username: req.session.username})
})

router.get("/login", async (req, res, next) => {
  if (req.session.authorized) {
    res.redirect("/")
    return
  }
  res.render("login")
})

router.get("/register", async (req, res, next) => {
  if (req.session.authorized) {
    res.redirect("/")
    return
  }
  res.render("login")
})

router.get("/logout", async (req, res, next) => {
  req.session.authorized = false
  res.redirect("/login")
})

module.exports = router
