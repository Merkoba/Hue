// Redraws a drawing canvas
Hue.canvas_redraw = function (args = {}) {
  let def_args = {
    context: false,
    click_x: false,
    click_y: false,
    drag: false,
    bg_color: false,
    colors: false,
    sizes: false,
    sector_index: false
  }

  args = Object.assign(def_args, args)

  if (args.sector_index === false) {
    args.sector_index = args.click_x.length
  }

  args.context.clearRect(
    0,
    0,
    args.context.canvas.width,
    args.context.canvas.height
  )

  args.context.lineJoin = "round"

  let draw_bg = true

  Hue.draw_image_context.putImageData(Hue.draw_image_current_snapshot.data, 0, 0)

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
    } else {
      args.context.moveTo(args.click_x[i] - 1, args.click_y[i])
    }

    args.context.lineTo(args.click_x[i], args.click_y[i])

    args.context.closePath()
    args.context.strokeStyle = args.colors[i]

    if (args.sizes) {
      args.context.lineWidth = args.sizes[i]
    } else {
      args.context.lineWidth = 2
    }

    args.context.stroke()
  }
}

// Opens the draw image window
Hue.open_draw_image = function (target) {
  Hue.draw_image_target = target
  let title = "Draw Image"

  if (target === "profilepic") {
    title = "Draw Profile Image"
  } else if (target === "background") {
    title = "Draw Background"
  }

  Hue.msg_draw_image.set_title(title)
  Hue.msg_draw_image.show()
}

// Starts a new draw image sector on mousedown
// Sectors are used to determine actions so undo and redo can be applied
Hue.draw_image_add_sector = function () {
  Hue.draw_image_current_snapshot.sectors.push(
    Hue.draw_image_current_snapshot.click_x.length
  )
}

// Setups the draw image window
Hue.setup_draw_image = function () {
  Hue.draw_image_context = Hue.el("#draw_image_area").getContext("2d")
  Hue.draw_image_context.scale(2, 2)
  let area = Hue.el("#draw_image_area")

  area.addEventListener("mousedown", function (e) {
    if (e.button === 2) {
      return
    }

    if (Hue.draw_color_picker_on) {
      Hue.draw_color_picker(e.offsetX, e.offsetY)
      Hue.toggle_draw_color_picker()
      return
    }

    if (Hue.draw_image_mode === "pencil") {
      Hue.draw_image_just_entered = false
      Hue.draw_image_check_increase_snapshot()
      Hue.draw_image_add_sector()
      Hue.draw_image_add_click(e.offsetX, e.offsetY, false)
      Hue.redraw_draw_image()
    } else if (Hue.draw_image_mode === "bucket") {
      let result = Hue.draw_image_bucket_fill(e.offsetX, e.offsetY)

      if (result) {
        Hue.draw_image_check_redo()
        Hue.increase_draw_image_snapshot(result)
      }
    }
  })

  area.addEventListener("mousemove", function (e) {
    if (Hue.draw_image_mode === "pencil") {
      if (Hue.mouse_is_down) {
        Hue.draw_image_add_click(
          e.offsetX,
          e.offsetY,
          !Hue.draw_image_just_entered
        )
        Hue.redraw_draw_image()
      }

      Hue.draw_image_just_entered = false
    }
  })

  area.addEventListener("mouseenter", function (e) {
    Hue.draw_image_just_entered = true
  })

  Hue.el("#draw_image_mode_select_pencil").addEventListener("click", function () {
    Hue.set_draw_image_mode_input("pencil")
  })

  Hue.el("#draw_image_mode_select_bucket").addEventListener("click", function () {
    Hue.set_draw_image_mode_input("bucket")
  })

  Hue.el("#draw_image_undo").addEventListener("click", function () {
    Hue.draw_image_undo()
  })

  Hue.el("#draw_image_redo").addEventListener("click", function () {
    Hue.draw_image_redo()
  })

  Hue.el("#draw_image_clear").addEventListener("click", function () {
    Hue.needs_confirm("clear_draw_image_func")
  })

  Hue.el("#draw_image_upload").addEventListener("click", function () {
    Hue.msg_draw_image.close()
    Hue.upload_draw_image()
  })

  Hue.el("#draw_image_color_picker").addEventListener("click", function () {
    Hue.toggle_draw_color_picker()
  })

  let select = ""

  for (let i=Hue.draw_image_pencil_size_step; i<=Hue.draw_image_max_pencil_size; i+=Hue.draw_image_pencil_size_step) {
    select += `<option value="${i}">${i}</option>`
  }

  Hue.el("#draw_image_pencil_size").innerHTML = select
  Hue.draw_image_prepare_settings()
  Hue.clear_draw_image_state()
}

// Prepares initial settings for the draw image window
Hue.draw_image_prepare_settings = function () {  
  Hue.el("#draw_image_pencil_color").addEventListener("click", function () {
    Hue.set_draw_image_mode_input("pencil")
  })

  Hue.el("#draw_image_pencil_color").addEventListener("change", function () {
    Hue.draw_image_pencil_color = this.value
  })

  Hue.el("#draw_image_bucket_color").addEventListener("click", function () {
    Hue.set_draw_image_mode_input("bucket")
  })

  Hue.el("#draw_image_bucket_color").addEventListener("change", function () {
    Hue.draw_image_bucket_color = this.value
  })

  Hue.el("#draw_image_pencil_size").addEventListener("change", function () {
    Hue.draw_image_pencil_size = this.value
  })
}

// Sets the input mode (pencil or bucket)
// Changes the appearance of the widgets to reflect this
Hue.set_draw_image_mode_input = function (m) {
  if (m === "pencil") {
   Hue.el("#draw_image_mode_select_pencil").classList.add("modal_icon_selected")
   Hue.el("#draw_image_mode_select_bucket").classList.remove("modal_icon_selected")
  } else if (m === "bucket") {
   Hue.el("#draw_image_mode_select_bucket").classList.add("modal_icon_selected")
   Hue.el("#draw_image_mode_select_pencil").classList.remove("modal_icon_selected")
  }

  Hue.draw_image_mode = m
}

// Creates a new snapshot level
// Snapshots are saved drawing states
// These are used as points to go back or forward,
// and do canvas drawing operations on top of them
// Instead of having a huge single set of drawing operations
Hue.increase_draw_image_snapshot = function (data) {
  let level = Hue.draw_image_current_snapshot.level + 1

  Hue.draw_image_snapshots[`level_${level}`] = {
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

  Hue.draw_image_current_snapshot = Hue.draw_image_snapshots[`level_${level}`]

  let keys = Object.keys(Hue.draw_image_snapshots)

  if (keys.length > Hue.draw_image_max_levels) {
    let lowest_key = keys.length

    for (let key in Hue.draw_image_snapshots) {
      let snapshot = Hue.draw_image_snapshots[key]

      if (snapshot.level < lowest_key) {
        lowest_key = snapshot.level
      }
    }

    delete Hue.draw_image_snapshots[`level_${lowest_key}`]
  }
}

// Clears the draw image
// Resets the snapshot level to 0
Hue.clear_draw_image_state = function () {
  let context = Hue.draw_image_context
  let bg_hex = Hue.colorlib.get_random_hex()

  context.fillStyle = bg_hex
  context.fillRect(0, 0, context.canvas.width, context.canvas.height)

  Hue.draw_image_pencil_color = Hue.colorlib.get_lighter_or_darker(bg_hex, 0.6)
  Hue.draw_image_bucket_color = Hue.colorlib.get_random_hex()
  Hue.el("#draw_image_pencil_color").value = Hue.draw_image_pencil_color
  Hue.el("#draw_image_bucket_color").value = Hue.draw_image_bucket_color

  Hue.set_draw_image_mode_input("pencil")
  Hue.draw_image_pencil_size = Hue.draw_image_default_pencil_size

  Hue.els("#draw_image_pencil_size option")
  .forEach(it => {
    if (it.value == Hue.draw_image_pencil_size) {
      it.selected = true
    }
  })

  Hue.draw_image_snapshots = {
    level_0: {
      level: 0,
      data: Hue.draw_image_get_image_data(),
      click_x: [],
      click_y: [],
      drag: [],
      color_array: [],
      size_array: [],
      sectors: [],
      sector_index: 0,
    },
  }

  Hue.draw_image_current_snapshot = Hue.draw_image_snapshots["level_0"]
}

// Redraws the draw image
Hue.redraw_draw_image = function () {
  Hue.canvas_redraw({
    context: Hue.draw_image_context,
    click_x: Hue.draw_image_current_snapshot.click_x,
    click_y: Hue.draw_image_current_snapshot.click_y,
    drag: Hue.draw_image_current_snapshot.drag,
    colors: Hue.draw_image_current_snapshot.color_array,
    sizes: Hue.draw_image_current_snapshot.size_array,
    sector_index: Hue.draw_image_current_snapshot.sector_index
  })
}

// Removes any redo levels above
// Makes current state the latest state
Hue.draw_image_clean_redo = function (i) {
  Hue.draw_image_current_snapshot.click_x = Hue.draw_image_current_snapshot.click_x.slice(
    0,
    i
  )
  Hue.draw_image_current_snapshot.click_y = Hue.draw_image_current_snapshot.click_y.slice(
    0,
    i
  )
  Hue.draw_image_current_snapshot.color_array = Hue.draw_image_current_snapshot.color_array.slice(
    0,
    i
  )
  Hue.draw_image_current_snapshot.size_array = Hue.draw_image_current_snapshot.size_array.slice(
    0,
    i
  )
  Hue.draw_image_current_snapshot.drag = Hue.draw_image_current_snapshot.drag.slice(
    0,
    i
  )

  let new_sectors = []

  for (let sector of Hue.draw_image_current_snapshot.sectors) {
    if (sector <= i) {
      new_sectors.push(sector)
    }
  }

  Hue.draw_image_current_snapshot.sectors = new_sectors

  for (let level in Hue.draw_image_snapshots) {
    if (
      Hue.draw_image_snapshots[level].level >
      Hue.draw_image_current_snapshot.level
    ) {
      delete Hue.draw_image_snapshots[level]
    }
  }
}

// Checks if the current snapshot levels has other snapshots above
Hue.draw_image_has_levels_above = function () {
  let level = Hue.draw_image_current_snapshot.level

  for (let key in Hue.draw_image_snapshots) {
    if (Hue.draw_image_snapshots[key].level > level) {
      return true
    }
  }

  return false
}

// Checks if the current state has redo levels above
Hue.draw_image_check_redo = function () {
  if (
    Hue.draw_image_current_snapshot.click_x.length !==
      Hue.draw_image_current_snapshot.sector_index ||
    Hue.draw_image_has_levels_above()
  ) {
    Hue.draw_image_clean_redo(Hue.draw_image_current_snapshot.sector_index)
  }
}

// Gets image data from the canvas
Hue.draw_image_get_image_data = function () {
  let context = Hue.draw_image_context
  let w = context.canvas.width
  let h = context.canvas.height
  let data = Hue.draw_image_context.getImageData(0, 0, w, h)

  return data
}

// Checks if a new snapshot should be created
Hue.draw_image_check_increase_snapshot = function () {
  if (
    Hue.draw_image_current_snapshot.click_x.length ===
      Hue.draw_image_current_snapshot.sector_index &&
    !Hue.draw_image_has_levels_above()
  ) {
    if (
      Hue.draw_image_current_snapshot.click_x.length >=
      Hue.draw_image_num_strokes_save
    ) {
      let sector =
        Hue.draw_image_current_snapshot.sectors[
          Hue.draw_image_current_snapshot.sectors.length - 1
        ]
      Hue.draw_image_clean_redo(sector)
      Hue.increase_draw_image_snapshot(Hue.draw_image_get_image_data())
    }
  }
}

// Register a new click to the current snapshot
Hue.draw_image_add_click = function (x, y, dragging) {
  Hue.draw_image_check_redo()
  Hue.draw_image_current_snapshot.click_x.push(x)
  Hue.draw_image_current_snapshot.click_y.push(y)
  Hue.draw_image_current_snapshot.color_array.push(Hue.draw_image_pencil_color)
  Hue.draw_image_current_snapshot.size_array.push(Hue.draw_image_pencil_size)
  Hue.draw_image_current_snapshot.drag.push(dragging)
  Hue.draw_image_current_snapshot.sector_index =
    Hue.draw_image_current_snapshot.click_x.length
}

// Turns the canvas drawing into a Blob and sends it to the server as an image upload
Hue.upload_draw_image = function (canvas = "#draw_image_area", type = "drawing", name = "draw_image") {
  Hue.el(canvas).toBlob(
    function (blob) {
      blob.name = name + ".png"
      
      if (Hue.draw_image_target === "image") {
        Hue.show_image_upload_comment(blob, type)
      } else if (Hue.draw_image_target === "profilepic") {
        Hue.profilepic_selected(blob, type)
      } else if (Hue.draw_image_target === "background") {
        Hue.background_selected(blob)
      }
    },
    "image/png",
    0.95
  )
}

// Function wrapped in a confirm to be called from the GUI
Hue.clear_draw_image_func = function () {
  Hue.clear_draw_image_state()
}

// Performs an undo in the draw image
Hue.draw_image_undo = function () {
  if (Hue.draw_image_current_snapshot.sector_index > 0) {
    for (let sector of Hue.draw_image_current_snapshot.sectors
      .slice(0)
      .reverse()) {
      if (sector < Hue.draw_image_current_snapshot.sector_index) {
        Hue.draw_image_current_snapshot.sector_index = sector
        Hue.redraw_draw_image()
        break
      }
    }
  } else {
    let level = Hue.draw_image_current_snapshot.level - 1

    if (Hue.draw_image_snapshots[`level_${level}`] !== undefined) {
      Hue.draw_image_current_snapshot.sector_index = 0
      Hue.draw_image_current_snapshot =
        Hue.draw_image_snapshots[`level_${level}`]
      Hue.draw_image_current_snapshot.sector_index =
        Hue.draw_image_current_snapshot.click_x.length

      Hue.redraw_draw_image()
    }
  }
}

// Performs a redo in the draw image
Hue.draw_image_redo = function () {
  if (
    Hue.draw_image_current_snapshot.sector_index <
    Hue.draw_image_current_snapshot.click_x.length
  ) {
    let found = false

    for (let sector of Hue.draw_image_current_snapshot.sectors) {
      if (sector > Hue.draw_image_current_snapshot.sector_index) {
        Hue.draw_image_current_snapshot.sector_index = sector
        Hue.redraw_draw_image()
        found = true
        break
      }
    }

    if (!found) {
      if (
        Hue.draw_image_current_snapshot.sector_index !==
        Hue.draw_image_current_snapshot.click_x.length
      ) {
        Hue.draw_image_current_snapshot.sector_index =
          Hue.draw_image_current_snapshot.click_x.length
        Hue.redraw_draw_image()
      }
    }
  } else {
    let level = Hue.draw_image_current_snapshot.level + 1

    if (Hue.draw_image_snapshots[`level_${level}`] !== undefined) {
      Hue.draw_image_current_snapshot.sector_index =
        Hue.draw_image_current_snapshot.click_x.length
      Hue.draw_image_current_snapshot =
        Hue.draw_image_snapshots[`level_${level}`]
      Hue.draw_image_current_snapshot.sector_index = 0

      Hue.redraw_draw_image()
    }
  }
}

// Performs the draw image bucket fill algorithm
Hue.draw_image_bucket_fill = function (x, y) {
  let context = Hue.draw_image_context
  let w = context.canvas.width
  let h = context.canvas.height
  let image_data = Hue.draw_image_get_image_data()
  let data = image_data.data
  let node = [y * 2, x * 2]
  let target_color = Hue.get_canvas_node_color(data, node, w)
  let replacement_color = Hue.colorlib.hex_to_rgb_array(Hue.draw_image_bucket_color)
  replacement_color.push(255)

  if (Hue.colorlib.get_rgba_distance(target_color, replacement_color) <= Hue.draw_image_bucket_tolerance)  {
    return false
  }

  let q = []

  data = Hue.set_canvas_node_color(data, node, replacement_color, w)
  q.push(node)

  function check (node) {
    let color = Hue.get_canvas_node_color(data, node, w)
    if (Hue.colorlib.get_rgba_distance(color, target_color) <= Hue.draw_image_bucket_tolerance) {
      data = Hue.set_canvas_node_color(data, node, replacement_color, w)
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
Hue.get_canvas_node_index = function (data, node, w) {
  return (node[0] * w + node[1]) * 4
}

// Gets the color of a certain node in the canvas
Hue.get_canvas_node_color = function (data, node, w) {
  let index = Hue.get_canvas_node_index(data, node, w)
  return [data[index], data[index + 1], data[index + 2], data[index + 3]]
}

// Sets the color of a certain node in the canvas
Hue.set_canvas_node_color = function (data, node, values, w) {
  let index = Hue.get_canvas_node_index(data, node, w)

  data[index] = values[0]
  data[index + 1] = values[1]
  data[index + 2] = values[2]
  data[index + 3] = values[3]

  return data
}

// Toggles between pencil and bucket mode
Hue.draw_image_change_mode = function () {
  if (Hue.draw_image_mode === "pencil") {
    Hue.set_draw_image_mode_input("bucket")
  } else if (Hue.draw_image_mode === "bucket") {
    Hue.set_draw_image_mode_input("pencil")
  }
}

// Pick the color under the cursor
Hue.draw_color_picker = function (x, y) {
  let context = Hue.draw_image_context
  let w = context.canvas.width
  let image_data = Hue.draw_image_get_image_data()
  let data = image_data.data
  let node = [y * 2, x * 2]
  let array = Hue.get_canvas_node_color(data, node, w)
  let hex = Hue.colorlib.rgb_to_hex(array)

  if (Hue.draw_image_mode === "pencil") {
    Hue.draw_image_pencil_color = hex
    Hue.el("#draw_image_pencil_color").value = hex
  } else if (Hue.draw_image_mode === "bucket") {
    Hue.draw_image_bucket_color = hex
    Hue.el("#draw_image_bucket_color").value = hex
  }
}

// Toggle draw color picker
Hue.toggle_draw_color_picker = function () {
  Hue.draw_color_picker_on = !Hue.draw_color_picker_on

  if (Hue.draw_color_picker_on) {
    Hue.el("#draw_image_color_picker").classList.add("underlined")
  } else {
    Hue.el("#draw_image_color_picker").classList.remove("underlined")
  }
}

// Make a random drawing
Hue.make_random_drawing = function (target = "image") {
  Hue.draw_image_target = target
  
  jdenticon.update(Hue.el("#draw_random_canvas"), Hue.utilz.random_sequence(9), {
    backColor: Hue.colorlib.get_random_hex()
  })
  
  Hue.upload_draw_image("#draw_random_canvas", "random_canvas", "random_image")
}