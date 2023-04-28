// Redraws a drawing canvas
App.canvas_redraw = (args = {}) => {
  let def_args = {
    sector_index: args.click_x.length
  }

  args = Object.assign(def_args, args)

  args.context.clearRect(
    0,
    0,
    args.context.canvas.width,
    args.context.canvas.height
  )

  args.context.lineCap = `round`

  let draw_bg = true

  App.draw_image_context.putImageData(App.draw_image_current_snapshot.data, 0, 0)

  if (args.bg_color && draw_bg) {
    args.context.fillStyle = args.bg_color

    args.context.fillRect(
      0,
      0,
      args.context.canvas.width,
      args.context.canvas.height
    )
  }

  for (let i = 0; i < args.sector_index; i++) {
    args.context.beginPath()

    if (args.drag[i] && i) {
      args.context.moveTo(args.click_x[i - 1], args.click_y[i - 1])
    }
    else {
      args.context.moveTo(args.click_x[i] - 1, args.click_y[i])
    }

    args.context.lineTo(args.click_x[i], args.click_y[i])

    args.context.strokeStyle = args.colors[i]

    if (args.sizes) {
      args.context.lineWidth = args.sizes[i]
    }
    else {
      args.context.lineWidth = 2
    }

    args.context.stroke()
  }
}

// Opens the draw image window
App.open_draw_image = (target) => {
  App.draw_image_target = target
  App.set_draw_image_mode_input(`pencil`)
  App.set_draw_color_picker(false)
  App.msg_draw_image.show()
}

// Starts a new draw image sector on mousedown
// Sectors are used to determine actions so undo and redo can be applied
App.draw_image_add_sector = () => {
  App.draw_image_current_snapshot.sectors.push(
    App.draw_image_current_snapshot.click_x.length
  )
}

// Setups the draw image window
App.setup_draw_image = () => {
  App.draw_image_context = App.el(`#draw_image_area`).getContext(`2d`)
  App.draw_image_context.scale(2, 2)
  let area = App.el(`#draw_image_area`)

  App.ev(area, `mousedown`, (e) => {
    if (e.button === 2) {
      return
    }

    if (App.draw_color_picker_on) {
      App.draw_color_picker(e.offsetX, e.offsetY)
      App.toggle_draw_color_picker()
      return
    }

    if (App.draw_image_mode === `pencil`) {
      App.draw_image_just_entered = false
      App.draw_image_check_increase_snapshot()
      App.draw_image_add_sector()
      App.draw_image_add_click(e.offsetX, e.offsetY, false)
      App.redraw_draw_image()
    }
    else if (App.draw_image_mode === `bucket`) {
      let result = App.draw_image_bucket_fill(e.offsetX, e.offsetY)

      if (result) {
        App.draw_image_check_redo()
        App.increase_draw_image_snapshot(result)
      }
    }
  })

  App.ev(area, `mousemove`, (e) => {
    if (App.draw_image_mode === `pencil`) {
      if (App.mouse_is_down) {
        App.draw_image_add_click(
          e.offsetX,
          e.offsetY,
          !App.draw_image_just_entered
        )
        App.redraw_draw_image()
      }

      App.draw_image_just_entered = false
    }
  })

  App.ev(area, `mouseenter`, (e) => {
    App.draw_image_just_entered = true
  })

  App.ev(App.el(`#draw_image_mode_select_pencil`), `click`, () => {
    App.set_draw_image_mode_input(`pencil`)
  })

  App.ev(App.el(`#draw_image_mode_select_bucket`), `click`, () => {
    App.set_draw_image_mode_input(`bucket`)
  })

  App.ev(App.el(`#draw_image_undo`), `click`, () => {
    App.draw_image_undo()
  })

  App.ev(App.el(`#draw_image_redo`), `click`, () => {
    App.draw_image_redo()
  })

  App.ev(App.el(`#draw_image_clear`), `click`, () => {
    App.needs_confirm(`clear_draw_image_func`)
  })

  App.ev(App.el(`#draw_image_upload`), `click`, () => {
    App.msg_draw_image.close()
    App.upload_draw_image()
  })

  App.ev(App.el(`#draw_image_color_picker`), `click`, () => {
    App.toggle_draw_color_picker()
  })

  let select = ``

  for (let i=App.draw_image_pencil_size_step; i<=App.draw_image_max_pencil_size; i+=App.draw_image_pencil_size_step) {
    select += `<option value="${i}">${i}</option>`
  }

  App.el(`#draw_image_pencil_size`).innerHTML = select
  App.draw_image_prepare_settings()
  App.clear_draw_image_state()
}

// Prepares initial settings for the draw image window
App.draw_image_prepare_settings = () => {
  App.ev(App.el(`#draw_image_pencil_color`), `click`, () => {
    App.set_draw_image_mode_input(`pencil`)
  })

  let pencil_color = App.el(`#draw_image_pencil_color`)

  App.ev(pencil_color, `change`, () => {
    App.draw_image_pencil_color = pencil_color.value
  })

  App.ev(App.el(`#draw_image_bucket_color`), `click`, () => {
    App.set_draw_image_mode_input(`bucket`)
  })

  let bucket_color = App.el(`#draw_image_bucket_color`)

  App.ev(bucket_color, `change`, () => {
    App.draw_image_bucket_color = bucket_color.value
  })

  let pencil_size = App.el(`#draw_image_pencil_size`)

  App.ev(pencil_size, `change`, () => {
    App.draw_image_pencil_size = pencil_size.value
  })
}

// Sets the input mode (pencil or bucket)
// Changes the appearance of the widgets to reflect this
App.set_draw_image_mode_input = (m) => {
  if (m === `pencil`) {
   App.el(`#draw_image_mode_select_pencil`).classList.add(`buttonbox_active`)
   App.el(`#draw_image_mode_select_bucket`).classList.remove(`buttonbox_active`)
  }
  else if (m === `bucket`) {
   App.el(`#draw_image_mode_select_bucket`).classList.add(`buttonbox_active`)
   App.el(`#draw_image_mode_select_pencil`).classList.remove(`buttonbox_active`)
  }

  App.draw_image_mode = m
}

// Creates a new snapshot level
// Snapshots are saved drawing states
// These are used as points to go back or forward,
// and do canvas drawing operations on top of them
// Instead of having a huge single set of drawing operations
App.increase_draw_image_snapshot = (data) => {
  let level = App.draw_image_current_snapshot.level + 1

  App.draw_image_snapshots[`level_${level}`] = {
    level: level,
    data: data,
    click_x: [],
    click_y: [],
    drag: [],
    color_array: [],
    size_array: [],
    sectors: [],
    sector_index: 0,
  }

  App.draw_image_current_snapshot = App.draw_image_snapshots[`level_${level}`]

  let keys = Object.keys(App.draw_image_snapshots)

  if (keys.length > App.draw_image_max_levels) {
    let lowest_key = keys.length

    for (let key in App.draw_image_snapshots) {
      let snapshot = App.draw_image_snapshots[key]

      if (snapshot.level < lowest_key) {
        lowest_key = snapshot.level
      }
    }

    delete App.draw_image_snapshots[`level_${lowest_key}`]
  }
}

// Clears the draw image
// Resets the snapshot level to 0
App.clear_draw_image_state = () => {
  let context = App.draw_image_context
  let bg_hex = App.colorlib.get_random_hex()

  context.fillStyle = bg_hex
  context.fillRect(0, 0, context.canvas.width, context.canvas.height)

  App.draw_image_pencil_color = App.colorlib.get_lighter_or_darker(bg_hex, 0.6)
  App.draw_image_bucket_color = App.colorlib.get_random_hex()
  App.el(`#draw_image_pencil_color`).value = App.draw_image_pencil_color
  App.el(`#draw_image_bucket_color`).value = App.draw_image_bucket_color

  App.set_draw_image_mode_input(`pencil`)
  App.draw_image_pencil_size = App.draw_image_default_pencil_size

  App.els(`#draw_image_pencil_size option`)
  .forEach(it => {
    if (it.value == App.draw_image_pencil_size) {
      it.selected = true
    }
  })

  App.draw_image_snapshots = {
    level_0: {
      level: 0,
      data: App.draw_image_get_image_data(),
      click_x: [],
      click_y: [],
      drag: [],
      color_array: [],
      size_array: [],
      sectors: [],
      sector_index: 0,
    },
  }

  App.draw_image_current_snapshot = App.draw_image_snapshots[`level_0`]
}

// Redraws the draw image
App.redraw_draw_image = () => {
  App.canvas_redraw({
    context: App.draw_image_context,
    click_x: App.draw_image_current_snapshot.click_x,
    click_y: App.draw_image_current_snapshot.click_y,
    drag: App.draw_image_current_snapshot.drag,
    colors: App.draw_image_current_snapshot.color_array,
    sizes: App.draw_image_current_snapshot.size_array,
    sector_index: App.draw_image_current_snapshot.sector_index
  })
}

// Removes any redo levels above
// Makes current state the latest state
App.draw_image_clean_redo = (i) => {
  App.draw_image_current_snapshot.click_x = App.draw_image_current_snapshot.click_x.slice(
    0,
    i
  )
  App.draw_image_current_snapshot.click_y = App.draw_image_current_snapshot.click_y.slice(
    0,
    i
  )
  App.draw_image_current_snapshot.color_array = App.draw_image_current_snapshot.color_array.slice(
    0,
    i
  )
  App.draw_image_current_snapshot.size_array = App.draw_image_current_snapshot.size_array.slice(
    0,
    i
  )
  App.draw_image_current_snapshot.drag = App.draw_image_current_snapshot.drag.slice(
    0,
    i
  )

  let new_sectors = []

  for (let sector of App.draw_image_current_snapshot.sectors) {
    if (sector <= i) {
      new_sectors.push(sector)
    }
  }

  App.draw_image_current_snapshot.sectors = new_sectors

  for (let level in App.draw_image_snapshots) {
    if (
      App.draw_image_snapshots[level].level >
      App.draw_image_current_snapshot.level
    ) {
      delete App.draw_image_snapshots[level]
    }
  }
}

// Checks if the current snapshot levels has other snapshots above
App.draw_image_has_levels_above = () => {
  let level = App.draw_image_current_snapshot.level

  for (let key in App.draw_image_snapshots) {
    if (App.draw_image_snapshots[key].level > level) {
      return true
    }
  }

  return false
}

// Checks if the current state has redo levels above
App.draw_image_check_redo = () => {
  if (
    App.draw_image_current_snapshot.click_x.length !==
      App.draw_image_current_snapshot.sector_index ||
    App.draw_image_has_levels_above()
  ) {
    App.draw_image_clean_redo(App.draw_image_current_snapshot.sector_index)
  }
}

// Gets image data from the canvas
App.draw_image_get_image_data = () => {
  let context = App.draw_image_context
  let w = context.canvas.width
  let h = context.canvas.height
  let data = App.draw_image_context.getImageData(0, 0, w, h)

  return data
}

// Checks if a new snapshot should be created
App.draw_image_check_increase_snapshot = () => {
  if (
    App.draw_image_current_snapshot.click_x.length ===
      App.draw_image_current_snapshot.sector_index &&
    !App.draw_image_has_levels_above()
  ) {
    if (
      App.draw_image_current_snapshot.click_x.length >=
      App.draw_image_num_strokes_save
    ) {
      let sector =
        App.draw_image_current_snapshot.sectors[
          App.draw_image_current_snapshot.sectors.length - 1
        ]
      App.draw_image_clean_redo(sector)
      App.increase_draw_image_snapshot(App.draw_image_get_image_data())
    }
  }
}

// Register a new click to the current snapshot
App.draw_image_add_click = (x, y, dragging) => {
  App.draw_image_check_redo()
  App.draw_image_current_snapshot.click_x.push(x)
  App.draw_image_current_snapshot.click_y.push(y)
  App.draw_image_current_snapshot.color_array.push(App.draw_image_pencil_color)
  App.draw_image_current_snapshot.size_array.push(App.draw_image_pencil_size)
  App.draw_image_current_snapshot.drag.push(dragging)
  App.draw_image_current_snapshot.sector_index =
    App.draw_image_current_snapshot.click_x.length
}

// Turns the canvas drawing into a Blob and sends it to the server as an image upload
App.upload_draw_image = (canvas = `#draw_image_area`, type = `drawing`, name = `drawing`) => {
  App.el(canvas).toBlob(
    (blob) => {
      blob.name = name + `.png`

      if (App.draw_image_target === `image`) {
        App.show_image_upload_comment(blob, type)
      }
      else if (App.draw_image_target === `profilepic`) {
        App.profilepic_selected(blob, type)
      }
      else if (App.draw_image_target === `background`) {
        App.background_selected(blob)
      }
    },
    `image/png`,
    App.config.image_blob_quality
  )
}

// Function wrapped in a confirm to be called from the GUI
App.clear_draw_image_func = () => {
  App.clear_draw_image_state()
}

// Performs an undo in the draw image
App.draw_image_undo = () => {
  if (App.draw_image_current_snapshot.sector_index > 0) {
    for (let sector of App.draw_image_current_snapshot.sectors
      .slice(0)
      .reverse()) {
      if (sector < App.draw_image_current_snapshot.sector_index) {
        App.draw_image_current_snapshot.sector_index = sector
        App.redraw_draw_image()
        break
      }
    }
  }
  else {
    let level = App.draw_image_current_snapshot.level - 1

    if (App.draw_image_snapshots[`level_${level}`] !== undefined) {
      App.draw_image_current_snapshot.sector_index = 0
      App.draw_image_current_snapshot =
        App.draw_image_snapshots[`level_${level}`]
      App.draw_image_current_snapshot.sector_index =
        App.draw_image_current_snapshot.click_x.length

      App.redraw_draw_image()
    }
  }
}

// Performs a redo in the draw image
App.draw_image_redo = () => {
  if (
    App.draw_image_current_snapshot.sector_index <
    App.draw_image_current_snapshot.click_x.length
  ) {
    let found = false

    for (let sector of App.draw_image_current_snapshot.sectors) {
      if (sector > App.draw_image_current_snapshot.sector_index) {
        App.draw_image_current_snapshot.sector_index = sector
        App.redraw_draw_image()
        found = true
        break
      }
    }

    if (!found) {
      if (
        App.draw_image_current_snapshot.sector_index !==
        App.draw_image_current_snapshot.click_x.length
      ) {
        App.draw_image_current_snapshot.sector_index =
          App.draw_image_current_snapshot.click_x.length
        App.redraw_draw_image()
      }
    }
  }
  else {
    let level = App.draw_image_current_snapshot.level + 1

    if (App.draw_image_snapshots[`level_${level}`] !== undefined) {
      App.draw_image_current_snapshot.sector_index =
        App.draw_image_current_snapshot.click_x.length
      App.draw_image_current_snapshot =
        App.draw_image_snapshots[`level_${level}`]
      App.draw_image_current_snapshot.sector_index = 0

      App.redraw_draw_image()
    }
  }
}

// Performs the draw image bucket fill algorithm
App.draw_image_bucket_fill = (x, y) => {
  let context = App.draw_image_context
  let w = context.canvas.width
  let h = context.canvas.height
  let image_data = App.draw_image_get_image_data()
  let data = image_data.data
  let node = [y * 2, x * 2]
  let target_color = App.get_canvas_node_color(data, node, w)
  let replacement_color = App.colorlib.hex_to_rgb_array(App.draw_image_bucket_color)
  replacement_color.push(255)

  if (App.colorlib.get_rgba_distance(target_color, replacement_color) <= App.draw_image_bucket_tolerance) {
    return
  }

  let q = []

  data = App.set_canvas_node_color(data, node, replacement_color, w)
  q.push(node)

  function check (node) {
    let color = App.get_canvas_node_color(data, node, w)
    if (App.colorlib.get_rgba_distance(color, target_color) <= App.draw_image_bucket_tolerance) {
      data = App.set_canvas_node_color(data, node, replacement_color, w)
      q.push(node)
    }
  }

  while (q.length) {
    let n = q.shift()

    if (n[1] > 0) {
      check([n[0], n[1] - 1])
    }

    if (n[1] < w - 1) {
      check([n[0], n[1] + 1])
    }

    if (n[0] > 0) {
      check([n[0] - 1, n[1]])
    }

    if (n[0] < h - 1) {
      check([n[0] + 1, n[1]])
    }
  }

  image_data.data = data
  context.putImageData(image_data, 0, 0)
  return image_data
}

// Gets the index of a certain node in the canvas
App.get_canvas_node_index = (data, node, w) => {
  return (node[0] * w + node[1]) * 4
}

// Gets the color of a certain node in the canvas
App.get_canvas_node_color = (data, node, w) => {
  let index = App.get_canvas_node_index(data, node, w)
  return [data[index], data[index + 1], data[index + 2], data[index + 3]]
}

// Sets the color of a certain node in the canvas
App.set_canvas_node_color = (data, node, values, w) => {
  let index = App.get_canvas_node_index(data, node, w)

  data[index] = values[0]
  data[index + 1] = values[1]
  data[index + 2] = values[2]
  data[index + 3] = values[3]

  return data
}

// Toggles between pencil and bucket mode
App.draw_image_change_mode = () => {
  if (App.draw_image_mode === `pencil`) {
    App.set_draw_image_mode_input(`bucket`)
  }
  else if (App.draw_image_mode === `bucket`) {
    App.set_draw_image_mode_input(`pencil`)
  }
}

// Pick the color under the cursor
App.draw_color_picker = (x, y) => {
  let context = App.draw_image_context
  let w = context.canvas.width
  let image_data = App.draw_image_get_image_data()
  let data = image_data.data
  let node = [y * 2, x * 2]
  let array = App.get_canvas_node_color(data, node, w)
  let hex = App.colorlib.rgb_to_hex(array)

  if (App.draw_image_mode === `pencil`) {
    App.draw_image_pencil_color = hex
    App.el(`#draw_image_pencil_color`).value = hex
  }
  else if (App.draw_image_mode === `bucket`) {
    App.draw_image_bucket_color = hex
    App.el(`#draw_image_bucket_color`).value = hex
  }
}

// Toggle draw color picker
App.toggle_draw_color_picker = () => {
  App.set_draw_color_picker(!App.draw_color_picker_on)
}

// Set draw color picker
App.set_draw_color_picker = (what) => {
  App.draw_color_picker_on = what

  if (App.draw_color_picker_on) {
    App.el(`#draw_image_color_picker`).classList.add(`buttonbox_active`)
  }
  else {
    App.el(`#draw_image_color_picker`).classList.remove(`buttonbox_active`)
  }
}