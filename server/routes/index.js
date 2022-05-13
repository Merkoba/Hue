module.exports = function (db_manager, config, sconfig, utilz) {
  // Initial declarations
  const fs = require("fs")
  const path = require("path")
  const ejs = require("ejs")
  const jwt = require("jsonwebtoken")
  const express = require("express")
  const fetch = require("node-fetch")
  const router = express.Router()
  const view_check_delay = 5000
  let config_mtime = 0
  let view_mtime = ""

  // Object used to pass arguments
  const view = {}

  build_view()
  start_view_check()

  function build_view() {
    Object.keys(view).forEach(function(key) {
      delete view[key]
    })

    // Hold all public config here
    view.config = config

    // Other variables used to init session
    view.vars = {}

    // Compile all templates

    // Main handler object
    const handler = {}
    handler.public = {}

    // This holds the templates html to pass to the body compilation
    let templates_html = ""

    // Get the template file names
    const template_files = fs.readdirSync(
      path.join(__dirname, "../views/main/templates")
    )

    // Get all the templates html
    for (let file of template_files) {
      if (!file.endsWith(".ejs")) {
        continue
      }

      const template_path = path.join(
        __dirname,
        `../views/main/templates/${file}`
      )
      templates_html += ejs.compile(fs.readFileSync(template_path, "utf8"), {
        filename: template_path,
      })({
        vars: {
          commands_prefix: config.commands_prefix
        }
      })
    }

    // Compile svg files

    const svg_path = path.join(__dirname, "../views/main/svg")
    const svg_files = fs.readdirSync(svg_path)

    // Get all the svg html

    let svg_templates = "<div id='svg_templates' class='nodisplay'>"

    for (let file of svg_files) {
      let h = fs.readFileSync(path.join(svg_path, file), "utf8").trim()
      let name = `icon_${file.replace('.svg', '')}`
      h = h.replace("<svg", `<svg id="${name}" fill="currentColor"`)
      svg_templates += `\n${h}\n`
    }

    svg_templates += "</div>"

    // Create the main body template

    const body_html_path = path.join(__dirname, "../views/main/body.ejs")

    const compiled_body_html_template = ejs.compile(
      fs.readFileSync(body_html_path, "utf8"),
      {
        filename: body_html_path,
      }
    )

    view.body_html = compiled_body_html_template({
      templates: templates_html,
      svg: svg_templates
    })

    // Reserved usernames
    // These can't be used on registration
    view.reserved_usernames = [
      sconfig.system_username
    ].map((x) => x.toLowerCase())

    view_mtime = get_view_mtime()
    config_mtime = config.mtime
    utilz.loginfo("View built")
  }

  function walkdir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
      let dirPath = path.join(dir, f)
      let isDirectory = fs.statSync(dirPath).isDirectory()
      isDirectory ? 
        walkdir(dirPath, callback) : callback(path.join(dir, f))
    })
  }

  function get_view_mtime() {
    let mtime = ""

    walkdir(path.join(__dirname, "../views/main"), function (file) {
      mtime += fs.statSync(file).mtime.toString()
    })

    return mtime
  }

  function start_view_check() {
    setInterval(() => {
      if (get_view_mtime() !== view_mtime || config.mtime !== config_mtime) {
        build_view()
      }
    }, view_check_delay)
  }

  // Checks if a URL length exceeds the limits
  function check_url(req, res, next) {
    if (req.originalUrl.length > config.max_url_length) {
      return
    }

    if (req.params.id !== undefined) {
      let id = req.params.id.substr(0, sconfig.max_room_id_length)

      if (id === config.main_room_id) {
        res.redirect(`/`)
        return
      }
    }

    next()
  }

  // Checks if the user is logged in
  // If they're logged in they receive a jwt token
  // If not, they're redirected to the login page
  function require_login(req, res, next) {
    let fromurl = encodeURIComponent(req.originalUrl)

    if (req.session.user_id === undefined) {
      res.redirect(`/login?fromurl=${fromurl}`)
    } else {
      db_manager
        .get_user(["id", req.session.user_id], { password_date: 1 })

        .then((user) => {
          if (!user || req.session.password_date !== user.password_date) {
            req.session.destroy(function () {})
            res.redirect(`/login?fromurl=${fromurl}`)
          } else {
            jwt.sign(
              {
                exp: Math.floor(Date.now() + sconfig.jwt_expiration),
                data: { id: req.session.user_id },
              },
              sconfig.jwt_secret,
              function (err, token) {
                if (!err) {
                  req.jwt_token = token
                  next()
                }
              }
            )
          }
        })

        .catch((err) => {
          console.error(err)
        })
    }
  }

  // Login GET
  router.get("/login", check_url, function (req, res, next) {
    let c = {}

    c.vars = {}

    c.vars.fromurl = req.query.fromurl || ""
    c.vars.form_username = decodeURIComponent(req.query.form_username)
    c.vars.message = decodeURIComponent(req.query.message)
    c.vars.max_max_username_length = config.max_max_username_length
    c.vars.max_max_password_length = config.max_max_password_length
    c.vars.login_title = sconfig.login_title
    c.vars.recaptcha_enabled = sconfig.recaptcha_enabled
    c.vars.form_username = decodeURIComponent(req.query.form_username)

    if (sconfig.recaptcha_enabled) {
      c.vars.recaptcha_key = sconfig.recaptcha_key
    }

    res.render("login", c)
  })

  // Login POST
  router.post("/login", function (req, res, next) {
    let username = req.body.username
    let password = req.body.password

    if (username.length === 0 || username.length > config.max_max_username_length) {
      return
    }

    if (
      password.length === 0 ||
      password.length > config.max_max_password_length
    ) {
      return
    }

    if (sconfig.recaptcha_enabled) {
      check_captcha(req, res, function () {
        do_login(req, res, next)
      })
    } else {
      do_login(req, res, next)
    }
  })

  // Do the login check
  function do_login (req, res, next) {
    let username = req.body.username
    let password = req.body.password
    let fromurl = decodeURIComponent(req.body.fromurl)    

    db_manager.check_password(username, password, { password_date: true })

    .then((ans) => {
      if (ans.valid) {
        req.session.user_id = ans.user.id
        req.session.password_date = ans.user.password_date

        if (fromurl === undefined || fromurl === "" || fromurl === "/login") {
          res.redirect("/")
        } else {
          res.redirect(fromurl)
        }
      } else {
        req.session.destroy(function () {})

        let m = encodeURIComponent("Wrong username or password")
        let form_username = encodeURIComponent(username)
        res.redirect(`/login?message=${m}&form_username=${form_username}`)
      }
    })

    .catch((err) => {
      console.error(err)
    })
  }

  // Register GET
  router.get("/register", check_url, function (req, res, next) {
    let c = {}

    c.vars = {}

    c.vars.message = decodeURIComponent(req.query.message)
    c.vars.max_username_length = config.max_username_length
    c.vars.min_password_length = config.min_password_length
    c.vars.max_password_length = config.max_password_length
    c.vars.register_title = sconfig.register_title
    c.vars.recaptcha_enabled = sconfig.recaptcha_enabled
    c.vars.form_username = decodeURIComponent(req.query.form_username)

    if (sconfig.recaptcha_enabled) {
      c.vars.recaptcha_key = sconfig.recaptcha_key
    }

    res.render("register", c)
  })

  // Register POST
  router.post("/register", function (req, res, next) {
    let username = req.body.username
    let password = req.body.password

    if (view.reserved_usernames.includes(username.toLowerCase())) {
      already_exists(res, username)
      return
    }

    if (username.length === 0 || username.length > config.max_username_length) {
      return
    }

    if (username !== utilz.clean_username(username)) {
      return
    }

    if (
      password.length === 0 ||
      password.length < config.min_password_length ||
      password.length > config.max_password_length
    ) {
      return
    }

    if (sconfig.recaptcha_enabled) {
      check_captcha(req, res, function () {
        do_register(req, res, next)
      })
    } else {
      do_register(req, res, next)
    }
  })

  // Check captcha and run a callback
  function check_captcha (req, res, callback) {
    let recaptcha_response = req.body["g-recaptcha-response"]
    let remote_ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress

    if (
      recaptcha_response === undefined ||
      recaptcha_response === "" ||
      recaptcha_response === null
    ) {
      return
    }

    console.info("Fetching Recaptcha...")
    fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: `secret=${sconfig.recaptcha_secret_key}&response=${recaptcha_response}&remoteip=${remote_ip}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
    })

    .then((res) => res.json())

    .then((json) => {
      if (json.success) {
        callback()
      } else {
        let m = encodeURIComponent(`There was a problem verifying you're not a robot`)
        res.redirect(`/message?message=${m}`)
      }
    })

    .catch((err) => {
      let m = encodeURIComponent(`There was a problem verifying you're not a robot`)
      res.redirect(`/message?message=${m}`)
      console.error(err)
    })    
  }

  // Helper function
  function already_exists(res, username) {
    let m = encodeURIComponent("Username already exists")
    let form_username = encodeURIComponent(username)

    res.redirect(
      `/register?message=${m}&form_username=${form_username}`
    )
  }

  // Complete registration
  function do_register(req, res, next) {
    let username = req.body.username
    let password = req.body.password

    db_manager
      .get_user(
        ["username", username], { username: 1 }
      )

      .then((user) => {
        if (!user) {
          db_manager
            .create_user({
              username: username,
              password: password
            })

            .then((ans) => {
              res.redirect("/login")
              return
            })

            .catch((err) => {
              console.error(err)
            })
        } else {
          already_exists(res, username)
        }
      })

      .catch((err) => {
        console.error(err)
      })
  }

  // Shows a page with a message
  router.get("/message", check_url, function (req, res, next) {
    let c = {}
    c.vars = {}
    c.vars.message2 = decodeURIComponent(req.query.message)
    res.render("message", c)
  })

  // Logs out the user
  router.get("/logout", function (req, res, next) {
    req.session.destroy(function () {})
    res.redirect("/login")
  })

  // Enter root
  router.get("/", [check_url, require_login], function (req, res, next) {
    view.vars.room_id = config.main_room_id
    view.vars.user_id = req.session.user_id
    view.vars.jwt_token = req.jwt_token
    res.render("main/main", view)
  })

  // Enter a room
  router.get("/:id(\\w+)", [check_url, require_login], function (
    req,
    res,
    next
  ) {
    view.vars.room_id = req.params.id.substr(0, sconfig.max_room_id_length)
    view.vars.user_id = req.session.user_id
    view.vars.jwt_token = req.jwt_token
    res.render("main/main", view)
  })

  return router
}
