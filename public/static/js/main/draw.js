// Redraws the drawing area of a write whisper window
Hue.redraw_draw_message = function () {
  Hue.canvas_redraw({
    context: Hue.draw_message_context,
    click_x: Hue.draw_message_click_x,
    click_y: Hue.draw_message_click_y,
    drag: Hue.draw_message_drag,
  })
}

// Clears the drawing area of a write whisper window
Hue.clear_draw_message_state = function () {
  Hue.draw_message_click_x = []
  Hue.draw_message_click_y = []
  Hue.draw_message_drag = []

  Hue.draw_message_context.clearRect(
    0,
    0,
    Hue.draw_message_context.canvas.width,
    Hue.draw_message_context.canvas.height
  )
}

// Registers a click to the drawing area of a write whisper window
Hue.draw_message_add_click = function (x, y, dragging) {
  Hue.draw_message_click_x.push(x)
  Hue.draw_message_click_y.push(y)
  Hue.draw_message_drag.push(dragging)

  if (
    Hue.draw_message_click_x.length > Hue.config.draw_coords_max_array_length
  ) {
    Hue.draw_message_click_x.shift()
    Hue.draw_message_click_y.shift()
    Hue.draw_message_drag.shift()
  }
}

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
    sector_index: false,
    type: false,
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

  if (args.type === "draw_image") {
    Hue.draw_image_context.putImageData(
      Hue.draw_image_current_snapshot.data,
      0,
      0
    )
  }

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

    if (args.colors) {
      args.context.strokeStyle = args.colors[i]
    } else {
      args.context.strokeStyle = $("#draw_message_area").css("color")
    }

    if (args.sizes) {
      args.context.lineWidth = args.sizes[i]
    } else {
      args.context.lineWidth = 2
    }

    args.context.stroke()
  }
}

// Opens the draw image window
Hue.open_draw_image = function () {
  if (!Hue.can_image) {
    Hue.feedback("You don't have permission to draw images")
    return false
  }

  Hue.msg_draw_image.show()
}

// Returns a number used in draw image scaling
// It can have a different scale than 1:1 to produce higher resolution images
Hue.draw_image_scale_fix = function (n) {
  return parseInt(Math.round(n * Hue.draw_image_scale))
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
  Hue.draw_image_context = $("#draw_image_area")[0].getContext("2d")
  Hue.draw_image_context.scale(Hue.draw_image_scale, Hue.draw_image_scale)
  Hue.clear_draw_image_state()

  $("#draw_image_area").mousedown(function (e) {
    if (Hue.draw_image_mode === "bucket") {
      return false
    }

    Hue.draw_image_just_entered = false
    Hue.draw_image_check_increase_snapshot()
    Hue.draw_image_add_sector()
    Hue.draw_image_add_click(e.offsetX, e.offsetY, false)
    Hue.redraw_draw_image()
  })

  $("#draw_image_area").mousemove(function (e) {
    if (Hue.mouse_is_down) {
      Hue.draw_image_add_click(
        e.offsetX,
        e.offsetY,
        !Hue.draw_image_just_entered
      )
      Hue.redraw_draw_image()
    }

    Hue.draw_image_just_entered = false
  })

  $("#draw_image_area").mouseenter(function (e) {
    Hue.draw_image_just_entered = true
  })

  $("#draw_image_area").click(function (e) {
    if (Hue.draw_image_mode === "bucket") {
      let result = Hue.draw_image_bucket_fill(
        Hue.draw_image_scale_fix(e.offsetX),
        Hue.draw_image_scale_fix(e.offsetY)
      )

      if (result) {
        Hue.draw_image_check_redo()
        Hue.increase_draw_image_snapshot(result)
      }
    }
  })

  $("#draw_image_mode_select_pencil").click(function () {
    Hue.set_draw_image_mode_input("pencil")
  })

  $("#draw_image_mode_select_bucket").click(function () {
    Hue.set_draw_image_mode_input("bucket")
  })

  $("#draw_image_undo").click(function () {
    Hue.draw_image_undo()
  })

  $("#draw_image_redo").click(function () {
    Hue.draw_image_redo()
  })

  $("#draw_image_clear").click(function () {
    Hue.needs_confirm("clear_draw_image_func")
  })

  $("#draw_image_upload").click(function () {
    Hue.upload_draw_image()
  })
  
  let select = ""
  
  for (let i=2; i<=20; i+=2) {
    select += `<option value="${i}">${i}</option>`
  }

  $("#draw_image_pencil_size").html(select)

  Hue.draw_image_prepare_settings()
  Hue.horizontal_separator.separate("draw_image_buttons")
}

// Prepares initial settings for the draw image window
Hue.draw_image_prepare_settings = function () {
  Hue.draw_image_pencil_color = "#333333"
  Hue.draw_image_bucket_color = "#4898b7"
  Hue.draw_image_pencil_size = 4

  Hue.set_draw_image_mode_input("pencil")

  $("#draw_image_pencil_color").val(Hue.draw_image_pencil_color)

  $("#draw_image_pencil_color").click(function () {
    Hue.set_draw_image_mode_input("pencil")
  })

  $("#draw_image_pencil_color").change(function () {
    Hue.draw_image_pencil_color = $(this).val()
  })

  $("#draw_image_bucket_color").val(Hue.draw_image_bucket_color)

  $("#draw_image_bucket_color").click(function () {
    Hue.set_draw_image_mode_input("bucket")
  })

  $("#draw_image_bucket_color").change(function () {
    Hue.draw_image_bucket_color = $(this).val()
  })

  $("#draw_image_pencil_size")
    .find("option")
    .each(function () {
      if ($(this).val() == Hue.draw_image_pencil_size) {
        $(this).prop("selected", true)
      }
    })

  $("#draw_image_pencil_size").change(function () {
    Hue.draw_image_pencil_size = $(this).val()
  })
}

// Sets the input mode (pencil or bucket)
// Changes the appearance of the widgets to reflect this
Hue.set_draw_image_mode_input = function (m) {
  if (m === "pencil") {
    $("#draw_image_mode_select_pencil").addClass("modal_icon_selected")
    $("#draw_image_mode_select_bucket").removeClass("modal_icon_selected")
  } else if (m === "bucket") {
    $("#draw_image_mode_select_bucket").addClass("modal_icon_selected")
    $("#draw_image_mode_select_pencil").removeClass("modal_icon_selected")
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

  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, context.canvas.width, context.canvas.height)

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
    sector_index: Hue.draw_image_current_snapshot.sector_index,
    type: "draw_image",
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
Hue.upload_draw_image = function () {
  if (!Hue.can_image) {
    Hue.feedback("You don't have permission to change the image")
    return false
  }

  if (
    Hue.draw_image_current_snapshot.level === 0 &&
    Hue.draw_image_current_snapshot.click_x.length === 0
  ) {
    return false
  }

  $("#draw_image_area")[0].toBlob(
    function (blob) {
      blob.name = "draw_image.png"
      Hue.show_image_upload_comment(blob, "image_upload")
      Hue.msg_draw_image.close()
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
  let node = [y, x]
  let target_color = Hue.get_canvas_node_color(data, node, w)
  let replacement_color = Hue.colorlib.hex_to_rgb(Hue.draw_image_bucket_color)

  replacement_color.push(255)

  if (Hue.canvas_node_color_is_equal(target_color, replacement_color)) {
    return false
  }

  let q = []

  data = Hue.set_canvas_node_color(data, node, replacement_color, w)
  q.push(node)

  while (q.length) {
    let n = q.shift()

    if (n[1] > 0) {
      let nn = [n[0], n[1] - 1]
      let nn_color = Hue.get_canvas_node_color(data, nn, w)

      if (Hue.canvas_node_color_is_equal(nn_color, target_color)) {
        data = Hue.set_canvas_node_color(data, nn, replacement_color, w)
        q.push(nn)
      }
    }

    if (n[1] < w - 1) {
      let nn = [n[0], n[1] + 1]

      let nn_color = Hue.get_canvas_node_color(data, nn, w)

      if (Hue.canvas_node_color_is_equal(nn_color, target_color)) {
        data = Hue.set_canvas_node_color(data, nn, replacement_color, w)
        q.push(nn)
      }
    }

    if (n[0] > 0) {
      let nn = [n[0] - 1, n[1]]

      let nn_color = Hue.get_canvas_node_color(data, nn, w)

      if (Hue.canvas_node_color_is_equal(nn_color, target_color)) {
        data = Hue.set_canvas_node_color(data, nn, replacement_color, w)
        q.push(nn)
      }
    }

    if (n[0] < h - 1) {
      let nn = [n[0] + 1, n[1]]

      let nn_color = Hue.get_canvas_node_color(data, nn, w)

      if (Hue.canvas_node_color_is_equal(nn_color, target_color)) {
        data = Hue.set_canvas_node_color(data, nn, replacement_color, w)
        q.push(nn)
      }
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

// Determines if two node colors should be considered equal
Hue.canvas_node_color_is_equal = function (a1, a2) {
  let diff = 10
  let c1 = Math.abs(a1[0] - a2[0]) <= diff
  let c2 = Math.abs(a1[1] - a2[1]) <= diff
  let c3 = Math.abs(a1[2] - a2[2]) <= diff
  let alpha = Math.abs(a1[3] - a2[3]) <= diff

  return c1 && c2 && c3 && alpha
}

// Toggles between pencil and bucket mode
Hue.draw_image_change_mode = function () {
  if (Hue.draw_image_mode === "pencil") {
    Hue.set_draw_image_mode_input("bucket")
  } else if (Hue.draw_image_mode === "bucket") {
    Hue.set_draw_image_mode_input("pencil")
  }
}
