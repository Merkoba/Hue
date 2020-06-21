module.exports = function (
  handler,
  vars,
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger
) {
  // Find and provides a public or visited room list
  handler.public.roomlist = function (socket, data) {
    if (data.type === "visited_roomlist") {
      handler.get_visited_roomlist(socket.hue_user_id, function (rooms) {
        handler.user_emit(socket, "receive_roomlist", {
          roomlist: rooms,
          type: data.type,
        });
      });
    } else if (data.type === "public_roomlist") {
      handler.get_roomlist(function (rooms) {
        handler.user_emit(socket, "receive_roomlist", {
          roomlist: rooms,
          type: data.type,
        });
      });
    } else {
      return handler.get_out(socket);
    }
  };

  // Handles room creation
  handler.public.create_room = async function (socket, data) {
    if (
      data.name.length === 0 ||
      data.name.length > config.max_room_name_length
    ) {
      return handler.get_out(socket);
    }

    if (data.name !== utilz.clean_string2(data.name)) {
      return handler.get_out(socket);
    }

    if (data.public !== true && data.public !== false) {
      return handler.get_out(socket);
    }

    data.user_id = socket.hue_user_id;

    let force = false;

    if (socket.hue_superuser) {
      force = true;
    }

    let ans = await db_manager.user_create_room(data, force);

    if (ans === "wait") {
      handler.user_emit(socket, "create_room_wait", {});
      return;
    }

    handler.user_emit(socket, "room_created", { id: ans._id.toString() });
  };

  // Sorts a room list by user count and modified date
  handler.compare_roomlist = function (a, b) {
    if (a.usercount < b.usercount) {
      return 1;
    }

    if (a.usercount > b.usercount) {
      return -1;
    }

    if (a.usercount === b.usercount) {
      if (a.modified < b.modified) {
        return 1;
      }

      if (a.modified > b.modified) {
        return -1;
      }

      return 0;
    }
  };

  // Gets the public rooms list
  // It will fetch it from cache if still fresh
  handler.get_roomlist = async function (callback) {
    if (
      vars.last_roomlist === undefined ||
      Date.now() - vars.roomlist_last_get > config.roomlist_cache
    ) {
      let roomlist = [];
      let md = Date.now() - config.roomlist_max_inactivity;

      for (let room_id in vars.rooms) {
        let room = vars.rooms[room_id];

        if (room.public && room.modified > md) {
          roomlist.push({
            id: room._id,
            name: room.name,
            topic: room.topic.substring(0, config.max_roomlist_topic_length),
            usercount: handler.get_usercount(room._id),
            modified: room.modified,
          });
        }
      }

      roomlist.sort(handler.compare_roomlist).splice(config.max_roomlist_items);

      vars.last_roomlist = roomlist;
      vars.roomlist_last_get = Date.now();

      callback(vars.last_roomlist);
    } else {
      callback(vars.last_roomlist);
    }
  };

  // Gets the visited rooms list
  handler.get_visited_roomlist = async function (user_id, callback) {
    let roomlist = [];
    let userinfo = await db_manager.get_user(
      { _id: user_id },
      { visited_rooms: 1 }
    );
    let mids = [];

    for (let id of userinfo.visited_rooms) {
      if (typeof id === "string" && id !== config.main_room_id) {
        mids.push(new vars.mongo.ObjectId(id));
      } else {
        mids.push(id);
      }
    }

    let results = await db_manager.find_rooms({ _id: { $in: mids } });

    if (!results) {
      return false;
    }

    for (let i = 0; i < results.length; i++) {
      let room = results[i];

      roomlist.push({
        id: room._id.toString(),
        name: room.name,
        topic: room.topic.substring(0, config.max_roomlist_topic_length),
        usercount: handler.get_usercount(room._id.toString()),
        modified: room.modified,
      });
    }

    roomlist.sort(handler.compare_roomlist);

    callback(roomlist);
  };
};
