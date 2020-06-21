module.exports = function (db_manager, config, sconfig, utilz) {
  // Initial declarations
  const fs = require("fs");
  const path = require("path");
  const ejs = require("ejs");
  const jwt = require("jsonwebtoken");
  const express = require("express");
  const fetch = require("node-fetch");
  const router = express.Router();

  // Object used to pass arguments
  const c = {};

  // Variables that should go in the config object
  c.vars = {};

  // Other variables that shouldn't go in the config object
  c.rvars = {};

  // Variables sent to templates
  const tvars = {
    notebook_background_source: config.notebook_background_source,
  };

  // Fill the config variables object
  require("./vars")(c, config);

  // Compile all templates

  // Main handler object
  const handler = {};
  handler.public = {};

  // This holds the templates html to pass to the body compilation
  let templates_html = "";

  // Get the template file names
  const template_files = fs.readdirSync(
    path.join(__dirname, "../views/main/templates")
  );

  // Get all the templates html
  for (let file of template_files) {
    const template_path = path.join(
      __dirname,
      `../views/main/templates/${file}`
    );
    templates_html += ejs.compile(fs.readFileSync(template_path, "utf8"), {
      filename: template_path,
    })({
      vars: tvars,
    });
  }

  // Create the main body template

  const body_html_path = path.join(__dirname, "../views/main/body.ejs");

  const compiled_body_html_template = ejs.compile(
    fs.readFileSync(body_html_path, "utf8"),
    {
      filename: body_html_path,
    }
  );

  c.body_html = compiled_body_html_template({
    templates: templates_html,
  });

  // Reserved usernames
  // These can't be used on registration
  const reserved_usernames = [
    config.system_username,
    config.image_ads_setter,
  ].map((x) => x.toLowerCase());

  // Checks if a URL length exceeds the limits
  function check_url(req, res, next) {
    if (req.originalUrl.length > config.max_url_length) {
      return false;
    }

    if (req.params.id !== undefined) {
      let id = req.params.id.substr(0, config.max_room_id_length);

      if (id === config.main_room_id) {
        res.redirect(`/`);
        return;
      }
    }

    next();
  }

  // Checks if the user is logged in
  // If they're logged in they receive a jwt token
  // If not, they're redirected to the login page
  function require_login(req, res, next) {
    let fromurl = encodeURIComponent(req.originalUrl);

    if (req.session.user_id === undefined) {
      res.redirect(`/login?fromurl=${fromurl}`);
    } else {
      db_manager
        .get_user({ _id: req.session.user_id }, { password_date: 1 })

        .then((user) => {
          if (!user || req.session.password_date !== user.password_date) {
            req.session.destroy(function () {});
            res.redirect(`/login?fromurl=${fromurl}`);
          } else {
            jwt.sign(
              {
                exp: Math.floor(Date.now() + config.jwt_expiration),
                data: { id: req.session.user_id },
              },
              sconfig.jwt_secret,
              function (err, token) {
                if (!err) {
                  req.jwt_token = token;
                  next();
                }
              }
            );
          }
        })

        .catch((err) => {
          console.error(err);
        });
    }
  }

  // Login GET
  router.get("/login", check_url, function (req, res, next) {
    let c = {};

    c.vars = {};

    c.vars.fromurl = req.query.fromurl || "";
    c.vars.message = decodeURIComponent(req.query.message);
    c.vars.max_max_password_length = config.max_max_password_length;
    c.vars.max_max_email_length = config.max_max_email_length;
    c.vars.login_title = config.login_title;
    c.vars.form_email = decodeURIComponent(req.query.form_email);

    res.render("login", c);
  });

  // Login POST
  router.post("/login", function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let fromurl = decodeURIComponent(req.body.fromurl);

    if (email.length === 0 || email.length > config.max_max_email_length) {
      return false;
    }

    if (
      password.length === 0 ||
      password.length > config.max_max_password_length
    ) {
      return false;
    }

    db_manager
      .check_password(email, password, { password_date: true })

      .then((ans) => {
        if (ans.valid) {
          req.session.user_id = ans.user._id.toString();
          req.session.password_date = ans.user.password_date;

          if (fromurl === undefined || fromurl === "" || fromurl === "/login") {
            res.redirect("/");
          } else {
            res.redirect(fromurl);
          }
        } else {
          req.session.destroy(function () {});

          let m = encodeURIComponent("Wrong email or password");
          let form_email = encodeURIComponent(email);

          res.redirect(`/login?message=${m}&form_email=${form_email}`);
        }
      })

      .catch((err) => {
        console.error(err);
      });
  });

  // Register GET
  router.get("/register", check_url, function (req, res, next) {
    let c = {};

    c.vars = {};

    c.vars.message = decodeURIComponent(req.query.message);
    c.vars.max_username_length = config.max_username_length;
    c.vars.min_password_length = config.min_password_length;
    c.vars.max_password_length = config.max_password_length;
    c.vars.max_email_length = config.max_email_length;
    c.vars.register_title = config.register_title;
    c.vars.recaptcha_enabled = config.recaptcha_enabled;
    c.vars.form_username = decodeURIComponent(req.query.form_username);
    c.vars.form_email = decodeURIComponent(req.query.form_email);

    if (config.recaptcha_enabled) {
      c.vars.recaptcha_key = sconfig.recaptcha_key;
    }

    res.render("register", c);
  });

  // Register POST
  router.post("/register", function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if (reserved_usernames.includes(username.toLowerCase())) {
      return false;
    }

    if (username.length === 0 || username.length > config.max_username_length) {
      return false;
    }

    if (username !== utilz.clean_string4(username)) {
      return false;
    }

    if (
      password.length === 0 ||
      password.length < config.min_password_length ||
      password.length > config.max_password_length
    ) {
      return false;
    }

    if (email.length === 0 || email.length > config.max_email_length) {
      return false;
    }

    if (email.indexOf("@") === -1 || email.indexOf(" ") !== -1) {
      return false;
    }

    if (email !== utilz.clean_string5(email)) {
      return false;
    }

    if (config.recaptcha_enabled) {
      let recaptcha_response = req.body["g-recaptcha-response"];
      let remote_ip =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      if (
        recaptcha_response === undefined ||
        recaptcha_response === "" ||
        recaptcha_response === null
      ) {
        return false;
      }

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
            do_register(req, res, next);
          } else {
            let m = encodeURIComponent(
              `There was a problem verifying you're not a robot`
            );
            res.redirect(`/message?message=${m}`);
          }
        })

        .catch((err) => {
          let m = encodeURIComponent(
            `There was a problem verifying you're not a robot`
          );
          res.redirect(`/message?message=${m}`);
          console.error(err);
        });
    } else {
      do_register(req, res, next);
    }
  });

  // Complete registration
  function do_register(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    db_manager
      .get_user(
        { $or: [{ username: username }, { email: email }] },
        { username: 1 },
        false
      )

      .then((user) => {
        if (!user) {
          db_manager
            .create_user({
              username: username,
              password: password,
              email: email,
            })

            .then((ans) => {
              let m;

              if (ans === "done") {
                m = encodeURIComponent(
                  `Account verification link sent to ${email}\nYou must verify the email to be able to login\nEmail might take a couple of minutes to arrive`
                );
                res.redirect(`/message?message=${m}`);
              } else {
                m = encodeURIComponent("An error occurred");
                res.redirect(`/message?message=${m}`);
              }
            })

            .catch((err) => {
              console.error(err);
            });
        } else {
          let m = encodeURIComponent("Username or email already exist");
          let form_username = encodeURIComponent(username);
          let form_email = encodeURIComponent(email);

          res.redirect(
            `/register?message=${m}&form_username=${form_username}&form_email=${form_email}`
          );
        }
      })

      .catch((err) => {
        console.error(err);
      });
  }

  // Verify with emailed registration code
  router.get("/verify", check_url, function (req, res, next) {
    let token = req.query.token;

    if (token.length === 0) {
      return false;
    }

    if (token.indexOf("_") === -1) {
      return false;
    }

    let split = token.split("_");

    let id = split[0];

    let code = split[1];

    db_manager
      .get_user(
        { _id: id, verification_code: code, verified: false },
        { registration_date: 1 }
      )

      .then((user) => {
        if (user) {
          if (
            Date.now() - user.registration_date <
            config.max_verification_time
          ) {
            db_manager
              .update_user(user._id, { verified: true })

              .then((ans) => {
                let m = encodeURIComponent("Account successfully verified");
                res.redirect(`/message?message=${m}`);
              })

              .catch((err) => {
                console.error(err);
              });
          } else {
            let m = encodeURIComponent("The link has expired");
            res.redirect(`/message?message=${m}`);
          }
        } else {
          let m = encodeURIComponent("The link has expired");
          res.redirect(`/message?message=${m}`);
        }
      })

      .catch((err) => {
        console.error(err);
      });
  });

  // Checks if username is already in use
  router.post("/check_username", function (req, res, next) {
    let username = req.body.username;

    if (
      username.length === 0 ||
      username.length > config.max_max_username_length
    ) {
      return false;
    }

    if (reserved_usernames.includes(username.toLowerCase())) {
      res.json({ taken: true });
      return;
    }

    db_manager
      .get_user({ username: username }, { username: 1 }, false)

      .then((user) => {
        let taken;

        if (user) {
          taken = true;
        } else {
          taken = false;
        }

        res.json({ taken: taken });
      })

      .catch((err) => {
        console.error(err);
      });
  });

  // Checks if email is already in use
  router.post("/check_email", function (req, res, next) {
    let email = req.body.email;

    if (email.length === 0 || email.length > config.max_max_email_length) {
      return false;
    }

    db_manager
      .get_user({ email: email }, { email: 1 }, false)

      .then((user) => {
        let taken;

        if (user) {
          taken = true;
        } else {
          taken = false;
        }

        res.json({ taken: taken });
      })

      .catch((err) => {
        console.error(err);
      });
  });

  // Goes to the recover password page
  router.get("/recover", check_url, function (req, res, next) {
    let c = {};

    c.vars = {};

    c.vars.message = decodeURIComponent(req.query.message);
    c.vars.max_max_email_length = config.max_max_email_length;

    res.render("recover", c);
  });

  // Recover password POST
  router.post("/recover", function (req, res, next) {
    let email = req.body.email;

    if (email.length === 0 || email.length > config.max_max_email_length) {
      return false;
    }

    if (email.indexOf("@") === -1 || email.indexOf(" ") !== -1) {
      return false;
    }

    db_manager
      .reset_user_password(email)

      .then((result) => {
        let m;

        if (result) {
          if (result === "done") {
            m = encodeURIComponent(
              `If an email matched we will send a password reset link to ${email}\nEmail might take a couple of minutes to arrive`
            );
            res.redirect(`/message?message=${m}`);
          } else if (result === "limit") {
            m = encodeURIComponent(
              "You must wait a while before resetting the password again"
            );
            res.redirect(`/message?message=${m}`);
          } else if (result === "error") {
            m = encodeURIComponent(
              "There was an error. Please try again later"
            );
            res.redirect(`/message?message=${m}`);
          } else {
            return false;
          }
        } else {
          m = encodeURIComponent(
            `If an email matched we will send a password reset link to ${email}\nEmail might take a couple of minutes to arrive`
          );
          res.redirect(`/message?message=${m}`);
        }
      })

      .catch((err) => {
        console.error(err);
      });
  });

  // Change password form
  router.get("/change_password", check_url, function (req, res, next) {
    let token = req.query.token;

    if (token.length === 0) {
      return false;
    }

    if (token.indexOf("_") === -1) {
      return false;
    }

    let split = token.split("_");

    let id = split[0];

    let code = split[1];

    db_manager
      .get_user(
        { _id: id, password_reset_code: code },
        { password_reset_link_date: 1 }
      )

      .then((user) => {
        let m;

        if (user) {
          if (
            Date.now() - user.password_reset_link_date <
            config.password_reset_expiration
          ) {
            let c = {};

            c.vars = {};

            c.vars.min_password_length = config.min_password_length;
            c.vars.max_password_length = config.max_password_length;
            c.vars.message = decodeURIComponent(req.query.message);
            c.vars.token = token;

            res.render("change_password", c);
          } else {
            m = encodeURIComponent("The link has expired");
            res.redirect(`/message?message=${m}`);
          }
        } else {
          m = encodeURIComponent("The link has expired");
          res.redirect(`/message?message=${m}`);
        }
      })

      .catch((err) => {
        console.error(err);
      });
  });

  // Change password POST
  router.post("/change_password", function (req, res, next) {
    let token = req.body.token;

    let split = token.split("_");

    let id = split[0];

    let code = split[1];

    db_manager
      .get_user(
        { _id: id, password_reset_code: code },
        { password_reset_link_date: 1 }
      )

      .then((user) => {
        let m;

        if (user) {
          if (
            Date.now() - user.password_reset_link_date <
            config.password_reset_expiration
          ) {
            let password = req.body.password;

            if (
              password.length === 0 ||
              password.length < config.min_password_length ||
              password.length > config.max_password_length
            ) {
              return false;
            }

            db_manager
              .update_user(user._id, {
                password: password,
                password_reset_link_date: 0,
                password_date: Date.now(),
              })

              .catch((err) => {
                console.error(err);
              });

            m = encodeURIComponent("Password successfully changed");
            res.redirect(`/message?message=${m}`);
          } else {
            m = encodeURIComponent("The link has expired");
            res.redirect(`/message?message=${m}`);
          }
        } else {
          m = encodeURIComponent("The link has expired");
          res.redirect(`/message?message=${m}`);
        }
      })

      .catch((err) => {
        console.error(err);
      });
  });

  // Shows a page with a message
  router.get("/message", check_url, function (req, res, next) {
    let c = {};
    c.vars = {};
    c.vars.message2 = decodeURIComponent(req.query.message).replace(
      /\n/g,
      "<br>"
    );
    res.render("message", c);
  });

  // Logs out the user
  router.get("/logout", function (req, res, next) {
    req.session.destroy(function () {});
    res.redirect("/login");
  });

  // Enter root
  router.get("/", [check_url, require_login], function (req, res, next) {
    c.rvars.room_id = config.main_room_id;
    c.rvars.user_id = req.session.user_id;
    c.rvars.jwt_token = req.jwt_token;
    res.render("main/main", c);
  });

  // Enter a room
  router.get("/:id(\\w+)", [check_url, require_login], function (
    req,
    res,
    next
  ) {
    c.rvars.room_id = req.params.id.substr(0, config.max_room_id_length);
    c.rvars.user_id = req.session.user_id;
    c.rvars.jwt_token = req.jwt_token;
    res.render("main/main", c);
  });

  return router;
};
