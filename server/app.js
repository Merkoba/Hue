module.exports = function (db_manager, config, sconfig, utilz) {
  const express = require("express")
  const session = require("express-session")
  const path = require("path")
  const routes = require("./routes/index")(db_manager, config, sconfig, utilz)
  const rateLimit = require("express-rate-limit")
  const redis = require("redis")
  const RedisStore = require("connect-redis")(session)
  const redisClient = redis.createClient()

  let app = express()

  app.set("trust proxy", 1)

  // Limit to x reqs per y mins
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50
  })

  // Apply the limiter to these routes
  app.use("/change_password/", limiter);
  app.use("/login/", limiter);
  app.use("/register/", limiter);
  app.get("/", limiter);
  app.get("/:id(\\w+)", limiter);

  app.set("views", path.join(__dirname, "views"))
  app.set("view engine", "ejs")

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, "../public")))

  console.info(`ENV: ${app.get("env")}`)

  if (app.get("env") === "production" && config.https_enabled) {
    app.set("trust proxy", 1)
  }

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: sconfig.session_secret,
      resave: false,
      cookie: { maxAge: config.session_cookie_max_age }
    })
  )

  // app.use(session(sess))
  app.use("/", routes)

  app.use(function (req, res, next) {
    let err = new Error("Not Found")
    err.status = 404
    next(err)
  })

  if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500)

      res.render("error", {
        message: err.message,
        error: err,
      })
    })
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500)

    res.render("error", {
      message: err.message,
      error: {},
    })
  })

  return app
}
