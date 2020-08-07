const express = require("express")
const router = express.Router()

function getInt() {
  return Math.floor(Math.random()*16)
  // return 0
}

let primary = process.env.PRIMARY || getInt()
let secondary = process.env.SECONDARY || getInt()

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("shared/layout", {view: "../index", title: "Home", admin: req.session.authorized, p: primary, s: secondary})
})

router.get("/login", async (req, res, next) => {
  if (req.session.authorized) {
    res.redirect("/")
    return
  }
  // res.render("login", {p: primary, s: secondary})
  res.render("shared/layout", {view: "../login", title: "Login", admin: req.session.authorized, p: primary, s: secondary})
})

/*
router.get("/register", async (req, res, next) => {
  if (req.session.authorized) {
    res.redirect("/")
    return
  }
  // res.render("login", {p: primary, s: secondary})
  res.render("shared/layout", {view: "login.ejs", title: "Login", admin: req.session.authorized, p: primary, s: secondary})
})
*/

router.get("/logout", async (req, res, next) => {
  req.session.authorized = false
  res.redirect("/")
})

router.get("/tutorial", async (req, res, next) => {
  // res.render("tutorial", {p: primary, s: secondary})
  res.render("shared/layout", {view: "../tutorial", title: "Tutorial", admin: req.session.authorized, p: primary, s: secondary})
})

module.exports = router
