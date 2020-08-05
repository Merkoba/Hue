// Setups user function buttons in the reaction box
Hue.setup_user_functions = function () {
  for (let i = 1; i < Hue.user_functions.length + 1; i++) {
    $(`#user_function_button_${i}`).click(function () {
      Hue.run_user_function(i)
    })

    $(`#user_function_button_${i}`).on("auxclick", function (e) {
      if (e.which === 2) {
        setTimeout(() => {
          Hue.open_user_function_in_settings(i)
        }, 100);
      }
    })
  }

  Hue.setup_user_function_titles()
}

// Executes the user function of a given number
Hue.run_user_function = function (n) {
  if (!Hue.user_functions.includes(n)) {
    return false
  }

  if (Hue.get_setting(`user_function_${n}`)) {
    Hue.execute_commands(`user_function_${n}`)
  } else {
    Hue.open_user_function_in_settings(n)
  }

  Hue.hide_reactions_box()
}

// Setups the user function switch feature
// This allows user functions to change positions between each other
// For instance user function 2 can change position with user function 4
Hue.setup_user_function_switch_selects = function () {
  $(".user_function_switch_select").each(function () {
    $(this).change(function () {
      let num2 = $(this).find("option:selected").val()

      if (num2 == "0") {
        return false
      }

      let num = $(this).data("number")
      let type = $(this).data("type")
      let o_user_function = Hue[type][`user_function_${num}`]
      let o_user_function_name = Hue[type][`user_function_${num}_name`]
      let n_user_function = Hue[type][`user_function_${num2}`]
      let n_user_function_name = Hue[type][`user_function_${num2}_name`]

      if (
        o_user_function_name ===
        Hue.config[`global_settings_default_user_function_${num}_name`]
      ) {
        o_user_function_name =
          Hue.config[`global_settings_default_user_function_${num2}_name`]
      }

      if (
        n_user_function_name ===
        Hue.config[`global_settings_default_user_function_${num2}_name`]
      ) {
        n_user_function_name =
          Hue.config[`global_settings_default_user_function_${num}_name`]
      }

      Hue[type][`user_function_${num}`] = n_user_function
      Hue[type][`user_function_${num}_name`] = n_user_function_name

      Hue[type][`user_function_${num2}`] = o_user_function
      Hue[type][`user_function_${num2}_name`] = o_user_function_name

      $(`#${type}_user_function_${num}`).val(Hue[type][`user_function_${num}`])
      $(`#${type}_user_function_${num}_name`).val(
        Hue[type][`user_function_${num}_name`]
      )

      $(`#${type}_user_function_${num2}`).val(
        Hue[type][`user_function_${num2}`]
      )
      $(`#${type}_user_function_${num2}_name`).val(
        Hue[type][`user_function_${num2}_name`]
      )

      $(this)
        .find("option")
        .each(function () {
          if ($(this).val() == "0") {
            $(this).prop("selected", true)
          }
        })

      if (
        Hue.active_settings(`user_function_${num}`) === type ||
        Hue.active_settings(`user_function_${num2}`) === type ||
        Hue.active_settings(`user_function_${num}_name`) === type ||
        Hue.active_settings(`user_function_${num2}_name`) === type
      ) {
        Hue.setup_user_function_titles()
      }

      Hue[`save_${type}`]()
    })
  })
}

// Setups the user function names in the reactions box
Hue.setup_user_function_titles = function () {
  let n = $(".user_function_button").length

  if (n === 0) {
    return false
  }

  for (let i = 1; i < n + 1; i++) {
    let t = Hue.utilz
      .clean_string2(Hue.get_setting(`user_function_${i}`))
      .substring(0, 100)

    if (!t) {
      t = "Empty User Function. Set what it does in the User Settings"
    }

    let name = Hue.get_setting(`user_function_${i}_name`)

    $(`#user_function_button_${i}`).text(name)
    $(`#user_function_button_${i}`).attr("title", t)
  }
}

// Opens the settings in the category where the user functions are and opens the toggler
Hue.open_user_function_in_settings = function (n) {
  Hue.open_user_settings_category("functions")
  Hue.go_to_user_settings_item(`user_function_${n}`)
}

// Special function used for all User Function actions
Hue.setting_user_function_do_action = function (number, type, save = true) {
  let cmds = Hue.utilz.remove_multiple_empty_lines(
    $(`#${type}_user_function_${number}`).val()
  )

  $(`#${type}_user_function_${number}`).val(cmds)

  Hue[type][`user_function_${number}`] = cmds

  if (Hue.active_settings(`user_function_${number}`) === type) {
    Hue.setup_user_function_titles()
  }

  if (save) {
    Hue[`save_${type}`]()
  }
}

// Special function used for all User Function name actions
Hue.setting_user_function_name_do_action = function (
  number,
  type,
  save = true
) {
  let val = Hue.utilz.clean_string2(
    $(`#${type}_user_function_${number}_name`).val()
  )

  if (!val) {
    val = Hue.config[`global_settings_default_user_function_${number}_name`]
  }

  $(`#${type}_user_function_${number}_name`).val(val)

  Hue[type][`user_function_${number}_name`] = val

  if (Hue.active_settings(`user_function_${number}_name`) === type) {
    Hue.setup_user_function_titles()
  }

  if (save) {
    Hue[`save_${type}`]()
  }
}

// Makes the user functions controls for the settings windows
Hue.make_settings_user_functions = function (type) {
  let s = ""

  for (let i = 1; i < Hue.user_functions.length + 1; i++) {
    let o = "<option value='0' selected>----</option>"

    for (let j = 1; j < Hue.user_functions.length + 1; j++) {
      if (i !== j) {
        o += `<option value='${j}'>Switch With ${j}</option>`
      }
    }

    s += Hue.template_settings_user_function({
      number: i,
      type: type,
      options: o,
    })
  }

  return s
}
