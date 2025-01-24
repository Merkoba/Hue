// Setups media
App.setup_media = () => {
  DOM.ev(DOM.el(`#media_image_frame`), `click`, () => {
    App.show_modal_image()
  })

  DOM.ev(DOM.el(`#media_image_error`), `click`, () => {
    App.show_modal_image()
  })

  DOM.ev(DOM.el(`.media_picker_content`, App.msg_image_picker.window), `click`, (e) => {
    App.media_picker_item_click(e.target)
  })

  DOM.ev(DOM.el(`.media_picker_content`, App.msg_tv_picker.window), `click`, (e) => {
    App.media_picker_item_click(e.target)
  })

  App.change_media_layout()
  App.apply_media_percentages()
  App.apply_media_positions()
  App.fix_frames()
}

// On media picker item click
App.media_picker_item_click = (el) => {
  let container = el.closest(`.announcement_content_container`)

  if (container) {
    if (el.closest(`.chat_username`)) {
      return
    }

    if (el.closest(`.chat_menu_button`)) {
      return
    }

    if (el.closest(`.announcement_content`)) {
      return
    }

    DOM.el(`.announcement_content`, container).click()
  }
}

// Get min or max media percentage
App.limit_media_percentage = (size) => {
  if (size < App.media_min_percentage) {
    size = App.media_min_percentage
  }
  else if (size > App.media_max_percentage) {
    size = App.media_max_percentage
  }

  return size
}

// Applies percentages changes to the chat and media elements based on current state
App.apply_media_percentages = () => {
  let mode = App.get_setting(`media_layout`)
  let p1 = App.limit_media_percentage(App.get_setting(`tv_size`))
  let p2 = 100 - p1

  if (mode === `column`) {
    DOM.el(`#media_tv`).style.height = `${p1}%`
    DOM.el(`#media_image`).style.height = `${p2}%`
    DOM.el(`#media_tv`).style.width = `100%`
    DOM.el(`#media_image`).style.width = `100%`
  }
  else if (mode === `row`) {
    DOM.el(`#media_tv`).style.width = `${p1}%`
    DOM.el(`#media_image`).style.width = `${p2}%`
    DOM.el(`#media_tv`).style.height = `100%`
    DOM.el(`#media_image`).style.height = `100%`
  }

  let c1 = App.limit_media_percentage(App.get_setting(`chat_size`))
  let c2 = 100 - c1

  if (App.get_setting(`main_layout`) === `column`) {
    DOM.el(`#main_rows_container`).style.flexDirection = `column-reverse`
    DOM.el(`#chat_main`).style.height = `${c1}%`
    DOM.el(`#media`).style.height = `${c2}%`
    DOM.el(`#chat_main`).style.width = `100%`
    DOM.el(`#media`).style.width = `100%`
  }
  else {
    DOM.el(`#main_rows_container`).style.flexDirection = `row`
    DOM.el(`#chat_main`).style.width = `${c1}%`
    DOM.el(`#media`).style.width = `${c2}%`
    DOM.el(`#chat_main`).style.height = `100%`
    DOM.el(`#media`).style.height = `100%`
  }
}

// Applies the image and tv positions based on current state
App.apply_media_positions = () => {
  let p = App.get_setting(`tv_position`)
  let tvp
  let ip

  if (p === `top`) {
    tvp = 1
    ip = 2
  }
  else if (p === `bottom`) {
    tvp = 2
    ip = 1
  }

  DOM.el(`#media_image`).style.order = ip
  DOM.el(`#media_tv`).style.order = tvp
}

// Initial change for current media
App.start_active_media = () => {
  App.change_media({
    type: `image`,
    play: false,
  })

  App.change_media({
    type: `tv`,
    play: false,
  })

  App.first_media_change = true
}

// Removes and item from a media changed array
App.remove_item_from_media_changed = (type, id) => {
  App[`${type}_changed`] = App[`${type}_changed`].filter((x) => x.id !== id)
}

// Checks how many elements (image, tv) are visible in the media section
App.num_media_elements_visible = () => {
  let num = 0

  for (let el of DOM.els(`#media_split .media_main_container`)) {
    if (!DOM.is_hidden(el)) {
      num += 1
    }
  }

  return num
}

// Tries to separate a comment from a URL when using change media commands
// The proper way is to use '/image url > comment'
// But if the > is ommitted it will still try to determine what each part is
App.get_media_change_inline_comment = (type, source) => {
  let comment = DOM.el(`#link_${type}_comment`).value

  if (comment) {
    // OK
  }
  else if (source.includes(`>`)) {
    let split = source.split(`>`)
    source = split[0].trim()
    comment = split.slice(1).join(`>`).trim()
  }
  else {
    let split = source.split(` `)
    let url = ``
    let cm = []

    for (let sp of split) {
      if (App.utilz.is_url(sp) && !url) {
        url = sp
      }
      else {
        cm.push(sp)
      }
    }

    if (url && (cm.length > 0)) {
      source = url
      comment = cm.join(` `)
    }
  }

  return {
    source,
    comment,
  }
}

// Creates a media object from initial data
// For instance it gets all the 'tv_*' properties
App.get_media_object_from_init_data = (type) => {
  let obj = {}

  for (let key in App.init_data) {
    if (key.startsWith(`${type}_`)) {
      obj[key.replace(`${type}_`, ``)] = App.init_data[key]
    }
  }

  return obj
}

// Hides the media area (image and tv)
App.hide_media = () => {
  DOM.hide(`#media`)
}

// Prepare media modes from initial data
App.prepare_active_media = () => {
  App.media_visibility_and_locks()
}

// Changes media visibility and locks based on current state
App.media_visibility_and_locks = () => {
  App.change_media_visibility(`image`)
  App.change_media_visibility(`tv`)
  App.change_media_lock_text(`image`)
  App.change_media_lock_text(`tv`)
}

// More media picker configurations
App.setup_media_pickers = () => {
  DOM.ev(DOM.el(`#image_picker_link`), `click`, () => {
    App.msg_image_picker.close()
    App.show_link_image()
  })

  DOM.ev(DOM.el(`#image_picker_upload`), `click`, () => {
    App.msg_image_picker.close()
  })

  DOM.ev(DOM.el(`#image_picker_draw`), `click`, () => {
    App.msg_image_picker.close()
    App.open_draw_image(`image`)
  })

  DOM.ev(DOM.el(`#image_picker_random`), `click`, () => {
    App.msg_image_picker.close()
    App.make_random_image(`image`)
  })

  DOM.ev(DOM.el(`#image_picker_screenshot`), `click`, () => {
    App.msg_image_picker.close()
    App.take_screenshot()
  })

  DOM.ev(DOM.el(`#tv_picker_link`), `click`, () => {
    App.msg_tv_picker.close()
    App.show_link_tv()
  })

  DOM.ev(DOM.el(`#tv_picker_upload`), `click`, () => {
    App.msg_tv_picker.close()
  })

  DOM.ev(DOM.el(`#tv_picker_capture`), `click`, () => {
    App.msg_tv_picker.close()
    App.screen_capture()
  })

  DOM.ev(DOM.el(`#image_picker_upload`), `click`, () => {
    App.msg_tv_picker.close()
    App.show_upload_image()
  })

  DOM.ev(DOM.el(`#tv_picker_upload`), `click`, () => {
    App.msg_tv_picker.close()
    App.show_upload_tv()
  })
}

// Setup tv link window
App.setup_media_link = () => {
  DOM.ev(DOM.el(`#link_image_submit`), `click`, () => {
    App.link_image_submit()
  })

  DOM.ev(DOM.el(`#link_tv_submit`), `click`, () => {
    App.link_tv_submit()
  })
}

// Updates the dimensions of a specified element
// It grows the element as much as it can while maintaining the aspect ratio
// This is done by making calculations with the element and parent's ratios
App.fix_frame = (frame_id, test_parent_height = false) => {
  let frame = DOM.el(`#${frame_id}`)
  let frame_ratio

  if (frame_id === `media_image_frame`) {
    frame_ratio = frame.naturalHeight / frame.naturalWidth
  }
  else {
    frame_ratio = 0.5625
  }

  let parent = frame.parentElement
  let info_height = 0
  let info = DOM.els(`.media_info`, frame.parentElement)

  if (info.length > 0) {
    info_height = info[0].offsetHeight
  }

  let parent_width = parent.offsetWidth

  let parent_height = test_parent_height ?
    test_parent_height :
    parent.offsetHeight - info_height
  let parent_ratio = parent_height / parent_width
  let width, height

  if (parent_ratio === frame_ratio) {
    width = parent_width
    height = parent_height
  }
  else if (parent_ratio < frame_ratio) {
    width = parent_height / frame_ratio
    height = parent_height
  }
  else if (parent_ratio > frame_ratio) {
    width = parent_width
    height = parent_width * frame_ratio
  }

  if (!test_parent_height) {
    frame.style.width = `${width}px`
    frame.style.height = `${height}px`
  }
  else {
    return {
      width,
      height,
      parent_width,
      parent_height,
    }
  }
}

// Updates dimensions of the image and tv
App.fix_frames = () => {
  if (!App.started) {
    return
  }

  App.fix_tv_frame()
  App.fix_image_frame()
}

// This handles all media load
// It will attempt to load and play media taking into account the room state
// It is responsible to initiate the construction of all required media players
App.change_media = (args = {}) => {
  let def_args = {
    force: false,
    play: true,
    current_source: false,
  }

  App.utilz.def_args(def_args, args)
  let item

  if (args.item) {
    item = args.item
  }
  else if (args.current_source && App[`loaded_${args.type}`].source) {
    item = App[`loaded_${args.type}`]
  }
  else {
    item = App[`current_${args.type}`]()
  }

  if (!App.has_focus) {
    if (item.username !== App.username) {
      App.on_activity(`media_change`)
    }

    return
  }

  if (args.type === `image`) {
    if (!args.force && (App.loaded_image.source === App.current_image().source)) {
      App.loaded_image = item
      return
    }
  }
  else if (args.type === `tv`) {
    if (!args.force && (App.loaded_tv.source === App.current_tv().source)) {
      App.loaded_tv = item
      return
    }
  }
  else {
    return
  }

  if (args.type === `image`) {
    if (!App.room_state.image_enabled) {
      return
    }

    if (
      !args.item &&
      App.image_locked &&
      App.loaded_image.source &&
      !args.current_source
    ) {
      return
    }

    if (!App.room_state.image_enabled) {
      return
    }

    App.loaded_image = item
    App.show_image(args.force)
  }
  else if (args.type === `tv`) {
    if (!App.room_state.tv_enabled) {
      return
    }

    if (!args.item &&
      App.tv_locked &&
      App.loaded_tv.source &&
      !args.current_source
    ) {
      return
    }

    if (!App.room_state.tv_enabled) {
      return
    }

    if (!App.loaded_tv.source && !args.force) {
      args.play = false
    }

    if (!App.get_setting(`autoplay`)) {
      args.play = false
    }

    if (item.type !== `video`) {
      if (App[`${item.type}_tv_player`] === undefined) {
        App.request_media(`${item.type}_tv_player`, args)
        return
      }
    }

    App.loaded_tv = item
    App[`show_${item.type}_tv`](args.play)
  }
  else {
    return
  }
}

// Sets a media info item with proper information and events
App.apply_media_info = (type) => {
  let item = App[`loaded_${type}`]

  if (!item.type) {
    return
  }

  let message = item.message.substring(0, App.config.max_media_info_length).trim()
  let container = DOM.el(`#media_${type}_info_container`)

  DOM.el(`.media_info`, container).innerHTML = App.template_media_info_inner({
    username: item.username,
    message,
    profilepic: App.get_profilepic(item.user_id),
  })

  DOM.el(`.media_info_date`, container).textContent = App.format_date(item.date)
  container.title = item.info
  let pic = DOM.el(`.media_info_profilepic`, container)

  DOM.ev(pic, `error`, () => {
    App.fallback_profilepic(pic)
  })

  DOM.dataset(container, `date`, item.date)
  DOM.dataset(container, `type`, type)
  DOM.dataset(container, `id`, item.id)
  DOM.dataset(container, `username`, item.username)
  DOM.dataset(container, `user_id`, item.user_id)
}

// Some fixes on reconneciton
App.fix_media_info = () => {
  App.apply_media_info(`image`)
  App.apply_media_info(`tv`)
}

// Sets media visibility
App.set_media_enabled = (args) => {
  if (args.what === App.room_state[`${args.type}_enabled`]) {
    return
  }

  App.room_state[`${args.type}_enabled`] = args.what

  if (App[`${args.type}_visible`] !== args.what) {
    App.change_media_visibility(args.type)
  }

  App.update_footer_toggle(args.type)
  App.save_room_state()
}

// Set the lock of media
App.set_media_locked = (args) => {
  let def_args = {
    change: true,
  }

  App.utilz.def_args(def_args, args)

  if (args.what === App[`${args.type}_locked`]) {
    return
  }

  App[`${args.type}_locked`] = args.what
  App.change_media_lock_text(args.type)

  if (!args.what && args.change) {
    App.change_media({type: args.type, play: false})
  }
}

// Toggles media locks for any type
App.change_media_lock_text = (type) => {
  if (App[`${type}_locked`]) {
    DOM.el(`#footer_${type}_lock`).textContent = `Unlock`
    DOM.el(`#footer_${type}_lock`).textContent = `Unlock`
    DOM.el(`#footer_${type}_lock`).classList.add(`underlined`)
  }
  else {
    DOM.el(`#footer_${type}_lock`).textContent = `Lock`
    DOM.el(`#footer_${type}_lock`).classList.remove(`underlined`)
  }
}

// Get html for media info items
App.get_media_info_html = (type) => {
  return App.template_media_info({type})
}

// Append media inf
App.append_media_info = (container, type) => {
  let el = DOM.create(`div`)
  el.innerHTML = App.get_media_info_html(type)
  DOM.el(container).append(el)
}

// Some initial media info setups
App.start_media_info = () => {
  App.append_media_info(`#media_image_container`, `image`)

  DOM.ev(DOM.el(`#media`), `click`, (e) => {
    let el = e.target.closest(`.media_info_profile`)

    if (el) {
      let user_id = DOM.dataset(el.closest(`.media_info_container`), `user_id`)
      App.show_profile(undefined, user_id)
      return
    }

    el = e.target.closest(`.media_info_menu`)

    if (el) {
      let media_info = el.closest(`.media_info_container`)
      let type = DOM.dataset(media_info, `type`)
      let id = DOM.dataset(media_info, `id`)
      App.open_url_menu_by_media_id(type, id)
      return
    }
  })

  DOM.ev(DOM.el(`#media`), `auxclick`, (e) => {
    let el = e.target.closest(`.media_info_profile`)

    if (el) {
      if (e.button === 1) {
        let username = DOM.dataset(el.closest(`.media_info_container`), `username`)
        App.mention_user(username)
        return
      }
    }
  })
}

// Get proper media string
App.media_string = (what) => {
  if (what === `chat`) {
    return `Chat`
  }
  else if (what === `image`) {
    return `Image`
  }
  else if (what === `tv`) {
    return `TV`
  }
}

// Load or restart media
App.load_media = (data) => {
  App.set_media_enabled({type: data.media_type, what: true})
  App.set_media_locked({type: data.media_type, what: true})

  App.change_media({
    type: data.media_type,
    item: data,
    force: true,
  })

  App.close_all_modals()
}

// Get media item by id
App.get_media_item = (type, id) => {
  for (let item of App[`${type}_changed`]) {
    if (item.id === id) {
      return item
    }
  }

  return {}
}

// Show the open url menu with data
App.open_url_menu_by_media_id = (type, id) => {
  let data = App.get_media_item(type, id)
  App.open_url_menu(data)
}

// Send a media edit comment emit to the server
App.do_edit_media_comment = (type, id, comment) => {
  App.socket_emit(`edit_media_comment`, {
    type,
    id,
    comment,
  })
}

// After response from the server after editing media comment
App.edited_media_comment = (data) => {
  let oitem = undefined

  for (let item of App[`${data.type}_changed`]) {
    if (item.id === data.id) {
      item.comment = data.comment
      item.message = App.get_media_message(item)
      oitem = item
      break
    }
  }

  let messages = DOM.els(`.media_announcement`)

  for (let message of messages) {
    if (DOM.dataset(message, `id`) === data.id) {
      if (DOM.dataset(message, `type`) === `${data.type}_change`) {
        let content = DOM.el(`.announcement_content`, message)
        content.textContent = oitem.message
        let data_container = DOM.el_or_self(`.unit_data_container`, message)
        DOM.dataset(data_container, `original_message`, data.comment)
      }
    }
  }

  App.apply_media_info(data.type)

  if (App.msg_modal_image.is_open()) {
    if (App.loaded_modal_image.id === data.id) {
      App.show_modal_image(App.loaded_modal_image.id)
    }
  }
}

// Shows the media picker window
App.show_media_picker = (type) => {
  App[`msg_${type}_picker`].show()
}

// Load media picker
App.load_media_link = (type, source, comment) => {
  DOM.el(`#link_${type}_comment`).value = comment
  DOM.el(`#link_${type}_input`).value = source

  App[`msg_link_${type}`].show()
  DOM.el(`#link_${type}_comment`).focus()
}

// Generate Image or TV item messages
App.get_media_message = (data) => {
  let message = ``

  if (data.title) {
    message = data.title
    if (data.comment) {
      message += ` (${data.comment})`
    }
  }
  else if (data.comment) {
    message = data.comment
  }

  if (!message) {
    if (data.query) {
      message = data.query
    }
  }

  if (!message) {
    if (data.size) {
      message = `Upload`
    }
    else {
      message = `Link (${data.hostname})`
    }
  }

  if (data.type === `youtube`) {
    let time = App.utilz.get_youtube_time(data.source)

    if (time !== 0) {
      message += ` (At ${App.utilz.humanize_seconds(time)})`
    }
  }

  return message
}

// Setups a media object
// This handles media objects received live from the server or from logged messages
// This is the entry function for media objects to get registered, announced, and be ready for use
App.setup_media_object = (type, mode, odata = {}) => {
  let data = {}

  data.id = odata.id
  data.user_id = odata.user_id
  data.type = odata.type
  data.source = odata.source
  data.title = odata.title
  data.username = odata.username
  data.size = odata.size
  data.date = odata.date
  data.query = odata.query
  data.comment = odata.comment
  data.media_type = type
  data.likes = odata.likes

  if (!data.source) {
    return
  }

  if (data.type === `upload`) {
    data.source = `${App.config.public_media_directory}/room/${App.room_id}/${type}/${data.source}`
  }

  data.nice_date = data.date ? App.nice_date(data.date) : App.nice_date()

  if (data.source.startsWith(`/`)) {
    data.source = window.location.origin + data.source
  }
  else if (data.source.startsWith(window.location.origin)) {
    if (!data.size) {
      for (let obj of App[`${type}_changed`]) {
        if (obj.source === data.source) {
          data.type = obj.type
          data.size = obj.size
          break
        }
      }
    }
  }

  if (!data.date) {
    data.date = Date.now()
  }

  let dc = data.nice_date.split(`|`)
  let days = dc[0].trim()
  let time = dc[1].trim()
  let info = []
  data.info_html = ``
  data.info_html += `<div>${days}</div>`
  data.info_html += `<div>${time}</div>`

  if (data.size) {
    info.push(`Size: ${App.utilz.size_string(data.size)}`)
    data.info_html += `<div>Size: ${App.utilz.size_string(data.size)}</div>`
  }

  if (data.query) {
    info.push(`Search Term: "${data.query}"`)
  }

  info.push(data.nice_date)
  data.hostname = App.utilz.get_hostname(data.source)
  data.message = App.get_media_message(data)

  if (!data.username) {
    info = []
    info.push(`Default ${App.utilz.capitalize_words(type)}`)
  }

  data.info = info.join(` | `)

  if (data.message) {
    data.message_id = App.announce_media(type, data).message_id
  }

  if (type === `tv`) {
    if (data.type === `upload`) {
      data.type = `video`
    }
  }

  if ((mode === `change`) || (mode === `show`)) {
    App[`push_${type}_changed`](data)
  }

  if (mode === `change`) {
    if (data.user_id === App.user_id) {
      App.set_media_locked({
        type,
        what: false,
        change: false,
      })
    }

    App.change_media({type})
  }
}

// Announce a media change to the chat
App.announce_media = (type, data) => {
  return App.public_feedback(data.message, {
    id: data.id,
    brk: App.get_chat_icon(type),
    title: data.info,
    date: data.date,
    username: data.username,
    type: `${type}_change`,
    user_id: data.user_id,
    media_source: data.source,
    comment: data.comment,
    likes: data.likes,
  })
}

// Changes the media visibility based on current state
App.change_media_visibility = (type, play = false) => {
  if (App.room_state[`${type}_enabled`]) {
    DOM.show(DOM.el(`#media`))
    DOM.show(DOM.el(`#media_${type}`))

    if (App.first_media_change && App.started) {
      App.change_media({type, force: true, current_source: App[`${type}_locked`], play})
    }

    App[`${type}_visible`] = true
    App[`fix_${type}_frame`]()
  }
  else {
    DOM.hide(`#media_${type}`)

    if (App.num_media_elements_visible() === 0) {
      App.hide_media()
    }

    App[`${type}_visible`] = false
  }

  if (type === `image`) {
    if (App.tv_visible) {
      App.fix_tv_frame()
    }
  }
  else if (type === `tv`) {
    if (App.image_visible) {
      App.fix_image_frame()
    }

    if (!App.tv_visible) {
      App.stop_tv()
    }
  }
}

// Check media info
App.check_media_info = () => {
  let mode = App.get_setting(`media_info`)
  let display

  if (mode === `hidden`) {
    display = `none`
  }
  else {
    display = `flex`
  }

  App.set_style_prop(`--media_info_display`, display)

  if (mode === `only_title`) {
    App.set_style_prop(`--media_info_user`, `none`)
  }
  else {
    App.set_style_prop(`--media_info_user`, `flex`)
  }

  if (mode === `only_user`) {
    App.set_style_prop(`--media_info_title`, `none`)
  }
  else {
    App.set_style_prop(`--media_info_title`, `flex`)
  }

  if (mode === `columns`) {
    App.set_style_prop(`--media_info_direction`, `column`)
  }
  else {
    App.set_style_prop(`--media_info_direction`, `row`)
  }
}

// Reply to media
App.reply_to_media = (type) => {
  let item = App.get_current_media(type)

  if (item && item.id) {
    let ans = App.get_message_by_id(item.id)

    if (ans) {
      App.start_reply(ans[0])
    }
  }
}

App.like_to_media = (type) => {
  let item = App.get_current_media(type)

  if (item && item.id) {
    let ans = App.get_message_by_id(item.id)

    if (ans) {
      let liked = App.message_is_liked(ans[0])
      let kind = liked ? `unlike` : `like`
      App.like_message(ans[0], kind)
    }
  }
}

App.context_to_media = (type) => {
  let item = App.get_current_media(type)

  if (item && item.id) {
    App.chat_search_by_id(item.id)
  }
}

App.jump_to_media = (type) => {
  let item = App.get_current_media(type)

  if (item && item.id) {
    let ans = App.get_message_by_id(item.id)

    if (ans) {
      let message = ans[0].closest(`.message`)
      let id = DOM.dataset(message, `message_id`)
      App.jump_to_chat_message(id, true)
    }
  }
}

// Get current media
App.get_current_media = (type) => {
  if (type === `link`) {
    return App.linksbar_item
  }

  let item

  if (App.room_state[`${type}_enabled`]) {
    item = App[`loaded_${type}`]
  }

  if (!item || !item.id) {
    item = App[`current_${type}`]()
  }

  return item
}

// Changes the media layout between row and column
App.change_media_layout = () => {
  let mode = App.get_setting(`media_layout`)

  if (mode === `column`) {
    DOM.el(`#media_split`).style.flexDirection = `column`

    for (let el of DOM.els(`.media_main_container`)) {
      el.style.width = `100%`
      el.style.height = `50%`
    }
  }
  else if (mode === `row`) {
    DOM.el(`#media_split`).style.flexDirection = `row`

    for (let el of DOM.els(`.media_main_container`)) {
      el.style.width = `50%`
      el.style.height = `100%`
    }
  }
}

// Shows the window to add a comment to an upload
App.show_upload_comment = (what, file, type, comment = ``) => {
  DOM.hide(`#${what}_upload_comment_feedback`)
  DOM.show(`#${what}_upload_comment_preview`)

  App[`${what}_upload_comment_file`] = file
  App[`${what}_upload_comment_type`] = type

  if (type === `drawing`) {
    DOM.el(`#${what}_upload_comment_change`).textContent = `Re-Draw`

    if (App.draw_suggested) {
      comment = `${App.draw_suggested} Drawing`
    }
  }
  else if (type === `upload`) {
    DOM.el(`#${what}_upload_comment_change`).textContent = `Re-Choose`
  }
  else if (type === `screenshot`) {
    DOM.el(`#${what}_upload_comment_change`).textContent = `Re-Take`
  }
  else if (type === `random_canvas`) {
    DOM.el(`#${what}_upload_comment_change`).textContent = `Re-Generate`
  }
  else if (type === `capture`) {
    DOM.el(`#${what}_upload_comment_change`).textContent = `Re-Capture`
  }

  if (!comment) {
    comment = App.get_input().trim()
    App.clear_input()
  }

  comment = comment || file.name

  let fname = App.utilz.slice_string_end(file.name, 20)
  let fsize = App.utilz.size_string(file.size, 2)
  let name = `${fname} (${fsize})`

  DOM.el(`#${what}_upload_name`).textContent = name
  DOM.el(`#${what}_upload_comment_preview`).src = URL.createObjectURL(file)
  let comment_input = DOM.el(`#${what}_upload_comment_input`)
  comment_input.value = comment
  App[`msg_${what}_upload_comment`].show()
  comment_input.focus()
}

// Attempts to change a media source
// It considers room state and permissions
// It considers text or url to determine if it's valid
// It includes a 'just check' flag to only return true or false
App.change_media_source = (args = {}) => {
  let def_args = {
    check: false,
    allow_query: true,
    allow_current: false,
    comment: ``,
  }

  App.utilz.def_args(def_args, args)
  let feedback = true

  if (args.check) {
    feedback = false
  }

  if (!args.comment) {
    let r = App.get_media_change_inline_comment(args.what, args.src)
    args.src = r.source
    args.comment = r.comment
  }

  if (args.comment.length > App.config.max_media_comment_length) {
    if (feedback) {
      App.checkmsg(`Comment is too long`)
    }

    return false
  }

  if (args.src.length === 0) {
    return false
  }

  args.src = App.utilz.single_space(args.src)

  if (args.src.length > App.config.max_media_source_length) {
    return false
  }

  if (args.src.startsWith(`/`)) {
    return false
  }

  let current = App[`current_${args.what}`]()

  if (!args.allow_current) {
    if ((args.src === current.source) || (args.src === current.query)) {
      if (feedback) {
        App.checkmsg(`Already set to that`)
      }

      return false
    }
  }

  if (App.utilz.is_url(args.src)) {
    if (args.what === `image`) {
      args.src = args.src.replace(/\.gifv/g, `.gif`)

      if (!App.utilz.is_image(args.src)) {
        if (feedback) {
          App.checkmsg(`Invalid extension`)
        }

        return false
      }
    }
    else if (args.what === `tv`) {
      if (App.utilz.is_youtube(args.src)) {
        if (App.utilz.get_youtube_id(args.src) && !App.config.youtube_enabled) {
          if (feedback) {
            App.checkmsg(`YouTube support is not enabled`)
          }

          return false
        }
      }
      else {
        let extension = App.utilz.get_extension(args.src).toLowerCase()

        if (extension && (App.utilz.is_video(args.src) || App.utilz.is_audio(args.src))) {
          // Is a video
        }
        else {
          return false
        }
      }
    }
  }
  else {
    if (!args.allow_query) {
      if (feedback) {
        App.checkmsg(`Query is not allowed`)
      }

      return false
    }

    if (args.src.length > App.config.safe_limit_1) {
      if (feedback) {
        App.checkmsg(`Query is too long`)
      }

      return false
    }

    if (args.what === `image`) {
      if (!App.config.imgur_enabled) {
        if (feedback) {
          App.checkmsg(`Imgur support is not enabled`)
        }

        return false
      }
    }
    else if (args.what === `tv`) {
      if (!App.config.youtube_enabled) {
        if (feedback) {
          App.checkmsg(`YouTube support is not enabled`)
        }

        return false
      }
    }
  }

  if (args.check) {
    return true
  }

  App.socket_emit(`change_${args.what}_source`, {src: args.src, comment: args.comment})
}

// Returns the current room media
// The last media in the media changed array
// This is not necesarily the user's loaded media
App.get_current_media_change = (what) => {
  let items = App[`${what}_changed`]

  if (items.length > 0) {
    return items[items.length - 1]
  }

  return {}
}

// Submits the upload media comment window
// Uploads the file and the optional comment
App.process_media_upload_comment = (what) => {
  if (!App[`msg_${what}_upload_comment`].is_open()) {
    return
  }

  let file = App[`${what}_upload_comment_file`]
  let comment = App.utilz.single_space(DOM.el(`#${what}_upload_comment_input`).value)

  if (comment.length > App.config.max_media_comment_length) {
    return
  }

  App.upload_file({file, action: `${what}_upload`, comment})
  App.close_all_modals()
}

// Submit linked media
App.link_media_submit = (what) => {
  let val = DOM.el(`#link_${what}_input`).value.trim()

  if (val !== ``) {
    App[`change_${what}_source`](val)
    App.close_all_modals()
  }
}

// Show media loaded
App.show_media_loaded = (id) => {
  if (!App.get_setting(`show_loaded`)) {
    return
  }

  let ans = App.get_message_by_id(id)

  if (ans && ans[0]) {
    let info = DOM.el_or_self(`.chat_info`, ans[0])

    if (info) {
      info.textContent = App.loaded_text
    }
  }
}

// Check if image or tv change
App.resolve_media_source = (arg) => {
  if (arg.includes(`\n`)) {
    return `none`
  }

  let src = arg.split(` `)[0]
  let obj = {src, check: true, allow_query: false}

  if (App.change_media_source({what: `image`, ...obj})) {
    return `image`
  }

  if (App.change_media_source({what: `tv`, ...obj})) {
    return `tv`
  }

  return `none`
}

// Resolve media URL and use it
App.media_command = (arg) => {
  let what = App.resolve_media_source(arg)

  if (what === `image`) {
    App.change_image_source(arg)
  }

  if (what === `tv`) {
    App.change_tv_source(arg)
  }
}

// Setup automedia
App.setup_automedia = () => {
  DOM.ev(DOM.el(`#automedia_change`), `click`, () => {
    App.automedia_change()
  })

  DOM.ev(DOM.el(`#automedia_chat`), `click`, () => {
    App.automedia_chat()
  })
}

// Check if the message is a media change
// Then ask if the user wants to use it
// Else the message is sent to the chat
App.automedia = (args) => {
  let what = App.resolve_media_source(args.message)

  if (what === `none`) {
    return false
  }

  function msg(name) {
    return `Change the ${name} using this URL`
  }

  let msg_el = DOM.el(`#automedia_message`)
  App.automedia_args = args
  App.automedia_what = what

  if (what === `image`) {
    msg_el.textContent = msg(`Image`)
    App.msg_automedia.show()
  }
  else if (what === `tv`) {
    msg_el.textContent = msg(`TV`)
    App.msg_automedia.show()
  }

  return true
}

// Automedia change the media
App.automedia_change = () => {
  App.change_media_source({
    what: App.automedia_what,
    src: App.automedia_args.message,
  })

  App.msg_automedia.close()
  App.clear_input()
}

// Automedia send to chat
App.automedia_chat = () => {
  let args = App.automedia_args
  args.automedia = false
  App.process_input(args)
  App.msg_automedia.close()
  App.clear_input()
}