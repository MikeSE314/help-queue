const express = require("express")
const router = express.Router()

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", {title: "Express"})
})

router.get("/login", async (req, res, next) => {
  res.render("login")
})

module.exports = router
