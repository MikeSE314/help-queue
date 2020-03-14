let createError = require("http-errors")
let express = require("express")
let path = require("path")
let cookieParser = require("cookie-parser")
// let logger = require("morgan")
let bodyParser = require("body-parser")
let session = require("express-session")

let indexRouter = require("./controllers/index.js")
let apiRouter = require("./controllers/api.js")

let app = express()

app.use(session({
  secret: "mysecret",
  resave: false,
  saveUninitialized: true
}))

// app.use((req, res, next) => {
  // req.session.au
  // if (!req.session.authorized) {
    // req.session.authorized = false
  // }
  // next()
// })

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/", indexRouter)
app.use("/api", apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  console.error(err)
  res.render("error", {error: err.status || 500})
})

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).json({})
  }
  next()
})

// module.exports = app

let http = require("http")

// app.set("port", port)

let server = http.createServer(app)
let io = require("socket.io").listen(server)

io.on("connection", (socket) => {
  socket.on("updateList", (data) => {
    io.emit("updateList")
  })
  socket.on("playSound", (data) => {
    io.emit("playSound")
  })
  socket.on("removed", (data) => {
    io.emit("removed", data)
  })
})



module.exports = server
