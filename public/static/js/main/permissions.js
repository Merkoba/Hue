// Checks if an op can perform an action
Hue.check_op_permission = function (role, permission) {
  if (role === "admin") {
    return true;
  }

  if (!role.startsWith("op")) {
    return false;
  }

  return Hue[`${role}_permissions`][permission];
};

// Changes a specified permission to a specified voice
Hue.change_voice_permission = function (vtype, ptype, what) {
  if (!Hue.check_op_permission(Hue.role, "voice_permissions")) {
    return false;
  }

  let p = Hue[`${vtype}_permissions`];

  if (!p) {
    return false;
  }

  if (what !== true && what !== false) {
    return false;
  }

  if (p[ptype] === what) {
    Hue.feedback(`That permission is already set to that`);
    return false;
  }

  Hue.socket_emit("change_voice_permission", {
    vtype: vtype,
    ptype: ptype,
    what: what,
  });
};

// Changes a specified permission to a specified op
Hue.change_op_permission = function (optype, ptype, what) {
  if (Hue.role !== "admin") {
    return false;
  }

  let p = Hue[`${optype}_permissions`];

  if (!p) {
    return false;
  }

  if (what !== true && what !== false) {
    return false;
  }

  if (p[ptype] === what) {
    Hue.feedback(`That permission is already set to that`);
    return false;
  }

  Hue.socket_emit("change_op_permission", {
    optype: optype,
    ptype: ptype,
    what: what,
  });
};

// Announces voice permission changes
Hue.announce_voice_permission_change = function (data) {
  let s = `${data.username} set ${data.vtype}.${data.ptype} to ${data.what}`;

  Hue[`${data.vtype}_permissions`][data.ptype] = data.what;
  Hue.show_room_notification(data.username, s);
  Hue.check_media_permissions();
  Hue.config_admin_permission_checkboxes();
};

// Announces op permission changes
Hue.announce_op_permission_change = function (data) {
  let s = `${data.username} set ${data.optype}.${data.ptype} to ${data.what}`;

  Hue[`${data.optype}_permissions`][data.ptype] = data.what;
  Hue.show_room_notification(data.username, s);
  Hue.config_room_menu();
  Hue.check_message_board_permissions();
  Hue.check_message_board_delay();
};

// Handle the voice permission command
Hue.change_voice_permission_command = function (arg) {
  let split = arg.split(" ");

  if (split.length !== 3) {
    return false;
  }

  let num = split[0];
  let type = split[1];
  let value = split[2];
  let ptype = `voice_${num}_${type}_permission`;

  if (Hue[ptype] === undefined) {
    Hue.feedback("Invalid format");
    return false;
  }

  if (value === "true" || value === "false") {
    value = JSON.parse(value);
  } else {
    Hue.feedback("Invalid value");
    return false;
  }

  Hue.change_voice_permission(ptype, value);
};

// Setups permissions from initial data
Hue.start_permissions = function (data) {
  Hue.voice_1_permissions = data.voice_1_permissions;
  Hue.voice_2_permissions = data.voice_2_permissions;
  Hue.voice_3_permissions = data.voice_3_permissions;
  Hue.voice_4_permissions = data.voice_4_permissions;

  Hue.op_1_permissions = data.op_1_permissions;
  Hue.op_2_permissions = data.op_2_permissions;
  Hue.op_3_permissions = data.op_3_permissions;
  Hue.op_4_permissions = data.op_4_permissions;
};

// Setups variables that determine if a user has permission to use certain media
Hue.check_media_permissions = function () {
  Hue.can_chat = Hue.check_media_permission(Hue.role, "chat");
  Hue.can_image =
    Hue.room_image_mode === "enabled" &&
    Hue.check_media_permission(Hue.role, "image");
  Hue.can_tv =
    Hue.room_tv_mode === "enabled" &&
    Hue.check_media_permission(Hue.role, "tv");
  Hue.can_radio =
    Hue.room_radio_mode === "enabled" &&
    Hue.check_media_permission(Hue.role, "radio");
  Hue.can_synth =
    Hue.room_synth_mode === "enabled" &&
    Hue.check_media_permission(Hue.role, "synth");

  Hue.setup_footer_icons();
};

// Checks whether a user can use a specified media
Hue.check_media_permission = function (role = false, type = false) {
  if (Hue.is_admin_or_op(role)) {
    return true;
  }

  if (role && type) {
    if (Hue[`${role}_permissions`][type]) {
      return true;
    }
  }

  return false;
};
