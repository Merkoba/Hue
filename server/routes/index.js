/* eslint-disable no-console */

module.exports = (db_manager, config, sconfig, utilz) => {
  const fs = require(`fs`)
  const path = require(`path`)
  const ejs = require(`ejs`)
  const jwt = require(`jsonwebtoken`)
  const express = require(`express`)
  const fetch = require(`node-fetch`)

  let router = express.Router()
  let view_check_delay = 5000
  let config_mtime = 0
  let view_mtime = ``

  // Object used to pass arguments
  const view = {}

  build_view()
  start_view_check()

  function build_view() {
    for (let key of Object.keys(view)) {
      delete view[key]
    }

    // Hold all public config here
    view.config = config

    // Other variables used to init session
    view.vars = {}

    // This holds the templates html to pass to the body compilation
    let templates_html = ``

    // Get the template file names
    let template_files = fs.readdirSync(
      path.join(__dirname, `../views/main/templates`),
    )

    // Get all the templates html
    for (let file of template_files) {
      if (!file.endsWith(`.ejs`)) {
        continue
      }

      let template_path = path.join(
        __dirname,
        `../views/main/templates/${file}`,
      )

      templates_html += ejs.compile(fs.readFileSync(template_path, `utf8`), {
        filename: template_path,
      })()
    }

    // Compile svg files

    let svg_path = path.join(__dirname, `../views/main/svg`)
    let svg_files = fs.readdirSync(svg_path)

    // Get all the svg html

    let svg_templates = `<div id='svg_templates' class='hidden'>`

    for (let file of svg_files) {
      let h = fs.readFileSync(path.join(svg_path, file), `utf8`).trim()
      let name = `icon_${file.replace(`.svg`, ``)}`
      h = h.replace(`<svg`, `<svg id="${name}" fill="currentColor"`)
      svg_templates += `\n${h}\n`
    }

    svg_templates += `</div>`

    // Create the main body template

    let body_html_path = path.join(__dirname, `../views/main/body.ejs`)

    let compiled_body_html_template = ejs.compile(
      fs.readFileSync(body_html_path, `utf8`), {
        filename: body_html_path,
      },
    )

    view.body_html = compiled_body_html_template({
      templates: templates_html,
      svg: svg_templates,
    })

    // Reserved usernames
    // These can't be used on registration
    view.reserved_usernames = [
      `admin`,
      sconfig.system_username,
    ].map((x) => x.toLowerCase())

    // Banned passwords
    // These can't be used on registration
    view.banned_passwords = [
      `pass`,
      `password`,
    ]

    view.imports = {}

    function import_string(ext, what, manual = []) {
      let files = [...manual]

      walkdir(path.join(__dirname, `../../public/static/assets/${ext}/${what}`), (file) => {
        if (!file.endsWith(`.${ext}`)) {
          return
        }

        let name = file.split(`/`).pop()

        if (files.includes(name)) {
          return
        }

        files.push(name)
      })

      let str = ``

      for (let name of files) {
        if (ext === `js`) {
          str += `<script src="/static/assets/${ext}/${what}/${name}"></script>\n`
        }
        else if (ext === `css`) {
          str += `<link rel="stylesheet" type="text/css" href="/static/assets/${ext}/${what}/${name}">\n`
        }
      }

      view.imports[`${ext}_${what}`] = str.trim()
    }

    if (sconfig.bundle_js_libs) {
      view.imports.js_libs = `<script src="/static/assets/js/build/libs.bundle.js"></script>`
    }
    else {
      import_string(`js`, `libs`)
    }

    if (sconfig.bundle_js_main) {
      view.imports.js_main = `<script src="/static/assets/js/build/main.bundle.js"></script>`
    }
    else {
      import_string(`js`, `main`, [`init.js`])
    }

    if (sconfig.bundle_css_libs) {
      view.imports.css_libs = `<link rel="stylesheet" type="text/css" href="/static/assets/css/build/libs.bundle.css">`
    }
    else {
      import_string(`css`, `libs`)
    }

    view_mtime = get_view_mtime()
    config_mtime = config.mtime
    utilz.loginfo(`View built`)
  }

  function walkdir(dir, callback) {
    for (let f of fs.readdirSync(dir)) {
      let dirPath = path.join(dir, f)
      let isDirectory = fs.statSync(dirPath).isDirectory()
      isDirectory ?
        walkdir(dirPath, callback) : callback(path.join(dir, f))
    }
  }

  function get_view_mtime() {
    let mtime = ``

    walkdir(path.join(__dirname, `../views/main`), (file) => {
      mtime += fs.statSync(file).mtime.toString()
    })

    return mtime
  }

  function start_view_check() {
    setInterval(() => {
      if ((get_view_mtime() !== view_mtime) || (config.mtime !== config_mtime)) {
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
  async function require_login(req, res, next) {
    let fromurl = encodeURIComponent(req.originalUrl)

    if (req.session.user_id === undefined) {
      res.redirect(`/login?fromurl=${fromurl}`)
    }
    else {
      try {
        let user = await db_manager.get_user([`id`, req.session.user_id], {password_date: 1})

        if (!user || (req.session.password_date !== user.password_date)) {
          req.session.destroy(() => {})
          res.redirect(`/login?fromurl=${fromurl}`)
        }
        else {
          jwt.sign(
            {
              exp: Math.floor(Date.now() + sconfig.jwt_expiration),
              data: {id: req.session.user_id},
            },
            sconfig.jwt_secret,
            (err, token) => {
              if (!err) {
                req.jwt_token = token
                next()
              }
            },
          )
        }
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  // Login GET
  router.get(`/login`, check_url, (req, res, next) => {
    let c = {}
    c.vars = {}
    c.vars.fromurl = req.query.fromurl || ``
    c.vars.form_username = decodeURIComponent(req.query.form_username)
    c.vars.message = decodeURIComponent(req.query.message)
    c.vars.max_max_username_length = config.max_max_username_length
    c.vars.max_max_password_length = config.max_max_password_length
    c.vars.login_title = sconfig.login_title
    c.vars.recaptcha_enabled = sconfig.recaptcha_enabled
    c.vars.form_username = decodeURIComponent(req.query.form_username)
    c.vars.default_title = config.default_title

    if (sconfig.recaptcha_enabled) {
      c.vars.recaptcha_key = sconfig.recaptcha_key
    }

    res.render(`login`, c)
  })

  // Login POST
  router.post(`/login`, (req, res, next) => {
    let username = req.body.username
    let password = req.body.password

    if ((username.length === 0) || (username.length > config.max_max_username_length)) {
      return
    }

    if (
      (password.length === 0) ||
      (password.length > config.max_max_password_length)
    ) {
      return
    }

    if (sconfig.recaptcha_enabled) {
      check_captcha(req, res, () => {
        do_login(req, res, next)
      })
    }
    else {
      do_login(req, res, next)
    }
  })

  // Do the login check
  async function do_login(req, res, next) {
    let username = req.body.username
    let password = req.body.password
    let fromurl = decodeURIComponent(req.body.fromurl)

    try {
      let ans = await db_manager.check_password(username, password, {password_date: true})

      if (ans.valid) {
        req.session.user_id = ans.user.id
        req.session.password_date = ans.user.password_date

        if ((fromurl === undefined) || (fromurl === ``) || (fromurl === `/login`)) {
          res.redirect(`/`)
        }
        else {
          res.redirect(fromurl)
        }
      }
      else {
        req.session.destroy(() => {})
        let m = encodeURIComponent(`Wrong username or password`)
        let form_username = encodeURIComponent(username)
        res.redirect(`/login?message=${m}&form_username=${form_username}`)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  // Register GET
  router.get(`/register`, check_url, (req, res, next) => {
    let c = {}

    c.vars = {}

    c.vars.message = decodeURIComponent(req.query.message)
    c.vars.max_username_length = config.max_username_length
    c.vars.min_password_length = config.min_password_length
    c.vars.max_password_length = config.max_password_length
    c.vars.register_title = sconfig.register_title
    c.vars.recaptcha_enabled = sconfig.recaptcha_enabled
    c.vars.form_username = decodeURIComponent(req.query.form_username)
    c.vars.use_register_code = sconfig.use_register_code
    c.vars.default_title = config.default_title

    if (sconfig.recaptcha_enabled) {
      c.vars.recaptcha_key = sconfig.recaptcha_key
    }

    res.render(`register`, c)
  })

  // Register POST
  router.post(`/register`, (req, res, next) => {
    if (sconfig.recaptcha_enabled) {
      check_captcha(req, res, () => {
        do_register(req, res, next)
      })
    }
    else {
      do_register(req, res, next)
    }
  })

  // Check captcha and run a callback
  async function check_captcha(req, res, callback) {
    let captcha_res = req.body[`g-recaptcha-response`]
    let remote_ip = req.headers[`x-forwarded-for`] || req.connection.remoteAddress

    if ([undefined, null, ``].includes(captcha_res)) {
      return
    }

    console.info(`Fetching Recaptcha...`)

    try {
      let k = sconfig.recaptcha_secret_key
      let body = `secret=${k}&response=${captcha_res}&remoteip=${remote_ip}`

      let ans = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: `POST`,
        body,
        headers: {
          "Content-Type": `application/x-www-form-urlencoded; charset=utf-8`,
        },
      })

      let json = await ans.json()

      if (json.success) {
        callback()
      }
      else {
        let m = encodeURIComponent(`There was a problem verifying you're not a robot`)
        res.redirect(`/message?message=${m}`)
      }
    }
    catch (err) {
      let m = encodeURIComponent(`There was a problem verifying you're not a robot`)
      res.redirect(`/message?message=${m}`)
      console.error(err)
    }
  }

  // Helper function
  function already_exists(res, username) {
    let m = encodeURIComponent(`Username already exists`)
    let form_username = encodeURIComponent(username)

    res.redirect(
      `/register?message=${m}&form_username=${form_username}`,
    )
  }

  // Complete registration
  async function do_register(req, res, next) {
    let username = req.body.username.trim()
    let password = req.body.password.trim()
    let code = req.body.code
    let ok = false

    let uname = username.toLowerCase()

    if (view.reserved_usernames.includes(uname)) {
      already_exists(res, username)
      return
    }

    if ((username.length === 0) || (username.length > config.max_username_length)) {
      return
    }

    if (username !== utilz.clean_username(username)) {
      return
    }

    if (
      (password.length === 0) ||
      (password.length < config.min_password_length) ||
      (password.length > config.max_password_length)
    ) {
      return
    }

    let passw = password.toLowerCase()

    // Avoid cases like admin:admin
    if (uname === passw) {
      return
    }

    if (view.banned_passwords.includes(passw)) {
      return
    }

    if (sconfig.use_register_code) {
      if (code === sconfig.register_code) {
        ok = true
      }
    }
    else {
      ok = true
    }

    if (!ok) {
      let codes_path = path.join(
        __dirname,
        `../../config/codes.json`,
      )

      if (fs.existsSync(codes_path)) {
        try {
          let codes = JSON.parse(fs.readFileSync(codes_path, `utf8`))

          if (codes.includes(code)) {
            ok = true
            codes = codes.filter((x) => x !== code)
            fs.writeFileSync(codes_path, JSON.stringify(codes), `utf8`)
          }
        }
        catch (err) {
          console.error(err)
          return
        }
      }
    }

    if (!ok) {
      return
    }

    try {
      let user = await db_manager.get_user([`username`, username], {username: 1})

      if (!user) {
        await db_manager.create_user({username, password})
        res.redirect(`/login`)
      }
      else {
        already_exists(res, username)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  // Shows a page with a message
  router.get(`/message`, check_url, (req, res, next) => {
    let c = {}
    c.vars = {}
    c.vars.message2 = decodeURIComponent(req.query.message)
    res.render(`message`, c)
  })

  // Logs out the user
  router.get(`/logout`, (req, res, next) => {
    req.session.destroy(() => {})
    res.redirect(`/login`)
  })

  // Enter root
  router.get(`/`, [check_url, require_login], (req, res, next) => {
    view.vars.room_id = config.main_room_id
    view.vars.user_id = req.session.user_id
    view.vars.jwt_token = req.jwt_token
    view.vars.default_title = config.default_title
    res.render(`main/main`, view)
  })

  // Enter a room
  router.get(`/:id(\\w+)`, [check_url, require_login], (
    req,
    res,
    next,
  ) => {
    view.vars.room_id = req.params.id.substr(0, sconfig.max_room_id_length)
    view.vars.user_id = req.session.user_id
    view.vars.jwt_token = req.jwt_token
    view.vars.default_title = config.default_title
    res.render(`main/main`, view)
  })

  return router
}