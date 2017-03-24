var fs = require('fs');
var path = require("path");
var shell = require('shelljs/global');
const antiSpam  = require('socket-anti-spam');
var mongo = require('mongodb');

var config = require('./config.json');
var secretpass = config.secretpass;

var last_roomlist;
var roomlist_lastget = 0;

var images_root = path.join(__dirname, 'public/img');

var db;

mongo.connect('mongodb://localhost:27017/hue', function(err,database) 
{
    if(err) 
	{ 
		console.error(err) 
	}
	else
	{
    	db = database;
	}
});

module.exports = function (io) 
{
	antiSpam.init(
	{
		banTime:            30,         // Ban time in minutes 
		kickThreshold:      20,          // User gets kicked after this many spam score 
		kickTimesBeforeBan: 1,          // User gets banned after this many kicks 
		banning:            true,       // Uses temp IP banning after kickTimesBeforeBan 
		heartBeatStale:     40,         // Removes a heartbeat after this many seconds 
		heartBeatCheck:     4,          // Checks a heartbeat per this many seconds 
		io:                 io,  // Bind the socket.io variable 
	})

	antiSpam.event.on('ban', function(socket, data)
	{
		socket.kickd = true;
		socket.info1 = "the anti-spam system";
		socket.disconnect();
	});

	io.on("connection", function(socket)
	{
		try
		{
			connection(socket);
		}
		catch(err)
		{
			console.error(err);
		}

		socket.on('join_room', function (data) 
		{
			try
			{
		    	join_room(socket, data);
			}
			catch(err)
			{
				console.error(err);
			}
		});

	    socket.on('sendchat', function (data) 
	    {
	    	try
	    	{
	    		sendchat(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('pasted', function (data) 
	    {
	    	try
	    	{
	    		pasted(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('uploading', function (data) 
	    {
	    	try
	    	{
	    		uploading(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('uploaded', function (data) 
	    {
	    	try
	    	{
	    		uploaded(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('username_change', function (data) 
	    {
	    	try
	    	{
	    		username_change(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('username_reserve', function (data) 
	    {
	    	try
	    	{
	    		username_reserve(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('username_recover', function (data) 
	    {
	    	try
	    	{
	    		username_recover(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('topic_change', function (data) 
	    {
	    	try
	    	{
	    		topic_change(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('roomlist', function (data) 
	    {
	    	try
	    	{
	    		roomlist(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('heartbeat', function (data) 
	    {
	    	try
	    	{
	    		heartbeat(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('claim_room', function (data) 
	    {
	    	try
	    	{
	    		claim_room(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('voice', function (data) 
	    {
	    	try
	    	{
	    		voice(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('op', function (data) 
	    {
	    	try
	    	{
	    		op(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('admin', function (data) 
	    {
	    	try
	    	{
	    		admin(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('strip', function (data) 
	    {
	    	try
	    	{
	    		strip(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('remove_voices', function (data) 
	    {
	    	try
	    	{
	    		remove_voices(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('remove_ops', function (data) 
	    {
	    	try
	    	{
	    		remove_ops(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('ban', function (data) 
	    {
	    	try
	    	{
	    		ban(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('unbanall', function (data) 
	    {
	    	try
	    	{
	    		unbanall(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('unbanlast', function (data) 
	    {
	    	try
	    	{
	    		unbanlast(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('bannedcount', function (data) 
	    {
	    	try
	    	{
	    		bannedcount(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('kick', function (data) 
	    {
	    	try
	    	{
	    		kick(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('change_mode', function (data) 
	    {
	    	try
	    	{
	    		change_mode(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('make_private', function (data) 
	    {
	    	try
	    	{
	    		make_private(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('make_public', function (data) 
	    {
	    	try
	    	{
	    		make_public(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

	    socket.on('change_radiosrc', function (data) 
	    {
	    	try
	    	{
	    		change_radiosrc(socket, data);
	    	}
	    	catch(err)
	    	{
	    		console.error(err);
	    	}
    	});

    	socket.on('disconnect', function()
    	{
    		try
    		{
    			disconnect(socket);
    		}
    		catch(err)
    		{
    			console.error(err);
    		}
    	});
	});

	// Socket Functions

	function connection(socket)
	{
		if(db === undefined)
		{
			socket.disconnect();
			return false;
		}

		socket.kickd = false;
		socket.bannd = false;		
	}

	function join_room(socket, data)
	{
		get_roominfo(data.room, {}, function(info)
	    {
	    	if(data.username === undefined || data.room === undefined || data.key === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0 || data.room.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

		    var bans = info.bans.split(';');

		   	socket.ip = socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress;

		    for(var i=0; i<bans.length; i++)
		    {
		    	if(bans[i] === socket.ip)
		    	{
		    		socket.disconnect();
		    		return false;
		    	}
		    }

			socket.room = data.room;
		    socket.join(socket.room);

		    socket.priv = '';
		    socket.key = '';

		    if(info.keys !== '' && data.key !== '')
		    {
		    	var skeys = info.keys.split(';');

		    	if(skeys.indexOf(data.key) !== -1)
		    	{
		    		socket.key = data.key;

					if(data.key.startsWith('_key_'))
					{
						socket.priv = 'admin';
					}
					else if(data.key.startsWith('_okey_'))
					{
						socket.priv = 'op';
					}
					else if(data.key.startsWith('_vkey_'))
					{
						socket.priv = 'voice';
					}
		    	}
		    }

	    	socket.username = make_username_unique((clean_string2(data.username.substring(0, 14))), get_usernames(socket.room));
	    	socket.emit('update', {room:socket.room, type:'username', username:socket.username, image_url:info.image_url, image_uploader:info.image_uploader, topic:info.topic, userlist:get_userlist(socket.room), priv:socket.priv, mode:info.mode, public:info.public, radiosrc:info.radiosrc, claimed:info.claimed});
	    	socket.broadcast.in(socket.room).emit('update', {type:'userjoin', usercount:get_usercount(socket.room), username:socket.username, priv:socket.priv});
	    });
	}

	function sendchat(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.msg === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.msg.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

			get_roominfo(socket.room, {mode:true}, function(info)
			{
	    		if(info.mode > 2)
	    		{
	    			if(socket.priv !== 'admin' && socket.priv !== 'op' && socket.priv !== 'voice')
	    			{
	    				return false;
	    			}
	    		}

				socket.broadcast.in(socket.room).emit('update', {type:'chat_msg', username:socket.username, msg:clean_string2(data.msg).substring(0, 1200)});

				db.collection('rooms').update({_id:info._id}, {$set:{modified:Date.now()}});
			});
		}
	}

	function pasted(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.image_url === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.image_url.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

			get_roominfo(socket.room, {mode:true}, function(info)
			{
				if(info.mode > 1)
				{
					if(socket.priv !== 'admin' && socket.priv !== 'op' && socket.priv !== 'voice')
					{
						return false;
					}
				}	    		

				data.image_url = data.image_url.replace(/\s/g,'').replace(/\.gifv/g,'.gif');

				var clean = check_image_url(data.image_url);

				if(clean)
				{
					var fname = socket.room + '_' + Date.now() + '.' + data.image_url.split('.').pop(-1);
					
					exec('wget -O ' + images_root + '/' + fname + ' -q \"' + data.image_url + '\"', function(status, output) 
					{
						exec('stat --printf="%s" ' + images_root + '/' + fname, function(status, output) 
						{
							if(parseInt(output) / 1000 <= 5555)
							{
								change_image(socket.room, fname, socket.username);
							}
							else 
							{
								exec("rm -f " + images_root + '/' + fname, function(status, output) 
								{

								});
							}
						});
					});
				}
			});
		}		
	}

	function uploading(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		get_roominfo(socket.room, {mode:true}, function(info)
    		{
	    		if(info.mode > 1)
	    		{
	    			if(socket.priv !== 'admin' && socket.priv !== 'op' && socket.priv !== 'voice')
	    			{
	    				return false;
	    			}
	    		}

	    		socket.broadcast.in(socket.room).emit('update', {type:'uploading', username:socket.username});
    		});
    	}		
	}

	function uploaded(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.image_file === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

			get_roominfo(socket.room, {mode:true}, function(info)
			{
				if(info.mode > 1)
				{
					if(socket.priv !== 'admin' && socket.priv !== 'op' && socket.priv !== 'voice')
					{
						return false;
					}
				}

				if(data.image_file.toString('ascii').length / 1000 > 5555)
				{
					return false;
				}

				data.name = data.name.replace(/\s/g,'');

				var clean = check_image_url(data.name);

				if(clean)
				{
					var fname = socket.room + '_' + Date.now() + '.' + data.name.split('.').pop(-1);

					fs.writeFile(images_root + '/' + fname, data.image_file, function (err,data) 
					{
						if(err) 
						{

						}
						else 
						{
		    				change_image(socket.room, fname, socket.username);
						}
					});
				}
			});
		}
	}

	function username_change(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.username === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

			get_roominfo(socket.room, {mode:true}, function(info)
			{
	    		if(info.mode > 2)
	    		{
	    			if(socket.priv !== 'admin' && socket.priv !== 'op' && socket.priv !== 'voice')
	    			{
	    				return false;
	    			}
	    		}

		    	var usernames = get_usernames(socket.room);

		    	for(var i = 0; i < usernames.length; i++)
		    	{
		    		if(usernames[i] == socket.username)
		    		{
		    			var old_username = usernames[i];
		    			socket.username = make_username_unique(clean_string2(data.username.substring(0, 14)), usernames);
		    			io.sockets.in(socket.room).emit('update', {type:'new_username', username:socket.username, old_username:old_username});
		    			return;
		    		}
		    	}
			});
		}		
	}

	function username_reserve(socket, data)
	{
		if(socket.username !== undefined)
		{
			get_userinfo(socket.username, function(userinfo)
			{
		    	if(userinfo.password == '')
		    	{
		    		userinfo.password = get_random_ukey();

		    		socket.emit('update', {room:socket.room, type:'reserved', password:userinfo.password});

		    		db.collection('users').update({_id:userinfo._id}, {$set:{password:userinfo.password}});
		    	}

		    	else
		    	{
		    		socket.emit('update', {room:socket.room, type:'alreadyreserved'});
		    	}
			});
		}		
	}

	function username_recover(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.username === undefined || data.password === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0 || data.password.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

			get_roominfo(socket.room, {mode:true}, function(info)
			{
				if(info.mode > 2)
				{
					if(socket.priv !== 'admin' && socket.priv !== 'op' && socket.priv !== 'voice')
					{
						return false;
					}
				}

				if(socket.username === data.username)
				{
					return false;
				}

		    	get_userinfo(data.username, function(userinfo)
		    	{
			    	if(userinfo.password !== '' && userinfo.password === data.password)
			    	{

			    		var sockets = io.sockets.adapter.rooms[socket.room].sockets;

			    		var keys = Object.keys(sockets);

			    		for(var i=0; i<keys.length; i++)
			    		{
			    			var sckt = io.sockets.connected[keys[i]];

			    			if(sckt.username === data.username)
			    			{
			    				sckt.username = make_username_unique('user', get_usernames(socket.room))
			    				io.sockets.in(socket.room).emit('update', {type:'new_username', username:sckt.username, old_username:data.username});
			    				break;
			    			};
			    		}

		    			var old_username = socket.username;
		    			socket.username = data.username;

			    		io.sockets.in(socket.room).emit('update', {type:'new_username', username:socket.username, old_username:old_username});
			    	}
			    	else
			    	{
			    		socket.emit('update', {room:socket.room, type:'couldnotrecover'});
			    	}	
		    	});
			});
		}		
	}

	function topic_change(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.topic === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.topic.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	get_roominfo(socket.room, {topic:true}, function(info)
	    	{
		    	if(socket.priv !== 'admin' && socket.priv !== 'op')
		    	{
		    		return false;
		    	}

		    	var new_topic = clean_string2(data.topic).substring(0, 400);

		    	if(new_topic.length > 0 && new_topic != info.topic)
		    	{
			    	info.topic = new_topic;
			    	io.sockets.in(socket.room).emit('update', {type:'topic_change', username:socket.username, topic:info.topic});
			    	
					db.collection('rooms').update({_id:info._id}, {$set:{topic:info.topic, modified:Date.now()}});
		    	}
	    	});
		}		
	}

	function roomlist(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		get_roomlist(function(rooms)
    		{
	    		socket.emit('update', {room:socket.room, type:'roomlist', roomlist:rooms});
    		})
    	}		
	}

	function heartbeat(socket, data)
	{
    	if(socket.username === undefined)
    	{
			socket.emit('update', {room:socket.room, type:'connection_lost'});
    	}		
	}

	function claim_room(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		if(socket.room === "main" && data.pass !== secretpass)
    		{
    			return false;
    		}

    		get_roominfo(socket.room, {claimed:true}, function(info)
    		{
	    		if(!info.claimed || data.pass === secretpass || socket.priv === 'admin')
	    		{
	    			socket.key = get_random_key();

	    			info.keys = socket.key;
    				info.claimed = true;

    				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

    				for(var i=0; i < ids.length; i++)
    				{
    					var socc = io.sockets.connected[ids[i]];
    					socc.priv = '';
    				}

    				socket.priv = 'admin';
    				
    				socket.emit('update', {room:socket.room, type:'get_key', key:socket.key});
					io.sockets.in(socket.room).emit('update', {type:'announce_claim', username:socket.username});

    				db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys, claimed:info.claimed, modified:Date.now()}});
	    		}
    		});
    	}		
	}

	function voice(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.username === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

			if(socket.username === data.username)
			{
				return false;
			}

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				if(socket.priv === 'admin' || socket.priv === 'op')
				{
					var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

					for(var i=0; i < ids.length; i++)
					{
						var socc = io.sockets.connected[ids[i]];

						if(socc.username === data.username)
						{
							if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
							{
								socket.emit('update', {room:socket.room, type:'forbiddenuser'});
								return false;
							}

							if(socc.priv === 'voice')
							{
								socket.emit('update', {room:socket.room, type:'isalready', what:'voice', who:data.username});
								return false;
							}

							socc.priv = 'voice';

							var repkey = replace_key(socc.priv, socc.key, info.keys);

							socc.key = repkey.key;
							info.keys = repkey.keys;

							io.to(ids[i]).emit('update', {type:'get_key', key:socc.key});
							io.sockets.in(socket.room).emit('update', {type:'announce_voice', username1:socket.username, username2:data.username});

							db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}});

							break;
						}
					}
				}
			});
		}		
	}

	function op(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.username === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				if(socket.priv === 'admin')
				{
					var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

					for(var i=0; i < ids.length; i++)
					{
						var socc = io.sockets.connected[ids[i]];

						if(socc.username === data.username)
						{
							if(socc.priv === 'op')
							{
								socket.emit('update', {room:socket.room, type:'isalready', what:'op', who:data.username});
								return false;
							}

							socc.priv = 'op';

							var repkey = replace_key(socc.priv, socc.key, info.keys);

							socc.key = repkey.key;
							info.keys = repkey.keys;

							io.to(ids[i]).emit('update', {type:'get_key', key:socc.key});
							io.sockets.in(socket.room).emit('update', {type:'announce_op', username1:socket.username, username2:data.username});

							db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}});								

							break;
						}
					}
				}
			});
		}		
	}

	function admin(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.username === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				if(socket.priv === 'admin')
				{
					var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

					for(var i=0; i < ids.length; i++)
					{
						var socc = io.sockets.connected[ids[i]];

						if(socc.username === data.username)
						{
							if(socc.priv === 'admin')
							{
								socket.emit('update', {room:socket.room, type:'isalready', what:'admin', who:data.username});
								return false;
							}

							socc.priv = 'admin';

							var repkey = replace_key(socc.priv, socc.key, info.keys);

							socc.key = repkey.key;
							info.keys = repkey.keys;

							io.to(ids[i]).emit('update', {type:'get_key', key:socc.key});
							io.sockets.in(socket.room).emit('update', {type:'announce_admin', username1:socket.username, username2:data.username});

							db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}});																

							break;
						}
					}
				}
			});
		}		
	}

	function strip(socket, data)
	{
    	if(socket.username !== undefined)
    	{
			if(data.username === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }   
		     		
    		if(socket.username === data.username)
    		{
    			return false;
    		}

    		get_roominfo(socket.room, {keys:true}, function(info)
    		{
    			if(socket.priv === 'admin' || socket.priv === 'op')
    			{
    				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

    				for(var i=0; i < ids.length; i++)
    				{
    					var socc = io.sockets.connected[ids[i]];

    					if(socc.username === data.username)
    					{
    						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
    						{
								socket.emit('update', {room:socket.room, type:'forbiddenuser'});
    							return false;
    						}

    						if(socc.priv === '')
    						{
								socket.emit('update', {room:socket.room, type:'isalready', what:'', who:data.username});
								return false;
    						}

    						socc.priv = '';

    						if(socc.key !== '')
    						{
    							info.keys = remove_key(socc.key, info.keys);
    							socc.key = '';
    						}

							io.sockets.in(socket.room).emit('update', {type:'announce_strip', username1:socket.username, username2:data.username});

    						db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}});																

							break;
    					}
    				}
    			}
    		});
    	}		
	}

	function remove_voices(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		get_roominfo(socket.room, {keys:true}, function(info)
    		{
	    		if(socket.priv === 'admin' || socket.priv === 'op')
	    		{
	    			var key_array = info.keys.split(';');

					var filtered_array = key_array.filter(function(item) 
					{

						return item.indexOf('_vkey_') !== 0;

					});

					if(key_array.length === filtered_array.length)
					{
    					socket.emit('update', {room:socket.room, type:'nothingtoremove'});
    					return false;
					}

					info.keys = filtered_array.join(';');

    				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

    				for(var i=0; i < ids.length; i++)
    				{
    					var socc = io.sockets.connected[ids[i]];

    					if(socc.priv === 'voice')
    					{
    						socc.priv = '';
    					}
    				}
    				
					io.sockets.in(socket.room).emit('update', {type:'announce_removedvoices', username:socket.username});

    				db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}});
	    		}
    		});
    	}		
	}

	function remove_ops(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		get_roominfo(socket.room, {keys:true}, function(info)
    		{
	    		if(socket.priv === 'admin')
	    		{
	    			var key_array = info.keys.split(';');

					var filtered_array = key_array.filter(function(item) 
					{

						return item.indexOf('_okey_') !== 0;

					});

					if(key_array.length === filtered_array.length)
					{
    					socket.emit('update', {room:socket.room, type:'nothingtoremove'});
    					return false;
					}

					info.keys = filtered_array.join(';');

    				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

    				for(var i=0; i < ids.length; i++)
    				{
    					var socc = io.sockets.connected[ids[i]];

    					if(socc.priv === 'op')
    					{
    						socc.priv = '';
    					}
    				}
    				
					io.sockets.in(socket.room).emit('update', {type:'announce_removedops', username:socket.username});

    				db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}});
	    		}
    		});
    	}		
	}

	function ban(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		if(data.username === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

    		get_roominfo(socket.room, {bans:true, keys:true}, function(info)
    		{
	    		if(socket.priv === 'admin' || socket.priv === 'op')
	    		{
    				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

    				for(var i=0; i < ids.length; i++)
    				{
    					var socc = io.sockets.connected[ids[i]];

    					if(socc.username === data.username)
    					{
    						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
    						{
    							socket.emit('update', {room:socket.room, type:'forbiddenuser'});
    							return false;
    						}

    						if(socc.ip === undefined)
    						{
    							return false;
    						}

    						if(socc.ip.indexOf('127.0.0.1') !== -1)
    						{
    							return false;
    						}

    						var bans = info.bans.split(';');

    						for(var i=0; i<bans.length; i++)
    						{
    							if(bans[i] === socc.ip)
    							{
    								return false;
    							}
    						}

    						if(bans === "")
    						{
    							info.bans = socc.ip;
    						}
    						else
    						{
    							info.bans += ";" + socc.ip;
    						}

    						for(var j=0; j < ids.length; j++)
    						{
    							var sokk = io.sockets.connected[ids[j]];

    							if(socc.ip === sokk.ip)
    							{
									if((sokk.priv === 'admin' || sokk.priv === 'op') && socket.priv !== 'admin')
									{
										continue;
									}

									if(sokk.username === socket.username)
									{
										continue;
									}

									sokk.priv = '';

									if(sokk.key !== '')
									{
										info.keys = remove_key(sokk.key, info.keys);
										sokk.key = '';
									}

		    						sokk.bannd = true;
		    						sokk.info1 = socket.username;

									io.to(ids[j]).emit('update', {type:'redirect', location:'/the street'});

		    						setTimeout(do_disconnect, 2000, sokk);
    							}
    						}

    						db.collection('rooms').update({_id:info._id}, {$set:{bans:info.bans, keys:info.keys}});

    						break;
    					}
    				}
    			}
    		});
    	}		
	}

	function unbanall(socket, data)
	{
		if(socket.username !== undefined)
		{
			get_roominfo(socket.room, {bans:true}, function(info)
			{
				if(socket.priv === 'admin' || socket.priv === 'op')
				{
					if(info.bans !== '')
					{
						info.bans = '';

						io.sockets.in(socket.room).emit('update', {type:'announce_unbanall', username:socket.username});
						
						db.collection('rooms').update({_id:info._id}, {$set:{bans:info.bans}});
					}
					else
					{
						socket.emit('update', {room:socket.room, type:'nothingtounban'});
					}
				}
			});
		}		
	}

	function unbanlast(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		get_roominfo(socket.room, {bans:true}, function(info)
    		{
	    		if(socket.priv === 'admin' || socket.priv === 'op')
	    		{
	    			if(info.bans !== '')
	    			{
	    				info.bans = info.bans.split(';').slice(0,-1).join(';');

						io.sockets.in(socket.room).emit('update', {type:'announce_unbanlast', username:socket.username});
						
						db.collection('rooms').update({_id:info._id}, {$set:{bans:info.bans}});
	    			}
	    			else
	    			{
    					socket.emit('update', {room:socket.room, type:'nothingtounban'});
	    			}
	    		}
    		});
    	}		
	}

	function bannedcount(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		get_roominfo(socket.room, {bans:true}, function(info)
    		{
	    		if(socket.priv === 'admin' || socket.priv === 'op')
	    		{
	    			if(info.bans === '')
	    			{
	    				var count = 0;
	    			}
	    			else
	    			{
	    				var count = info.bans.split(';').length;
	    			}

    				socket.emit('update', {room:socket.room, type:'get_bannedcount', count:count});
	    		}
    		});
    	}		
	}

	function kick(socket, data)
	{
    	if(socket.username !== undefined)
    	{
			if(data.username === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.username.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

    		if(socket.priv === 'admin' || socket.priv === 'op')
    		{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);

				for(var i=0; i < ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]];

					if(socc.username === data.username)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room, type:'forbiddenuser'});
							return false;
						}

						socc.priv = '';
						socc.key = '';
						socc.kickd = true;
						socc.info1 = socket.username;
						
						io.to(ids[i]).emit('update', {type:'redirect', location:'/the street'});

		    			setTimeout(do_disconnect, 2000, socc);

						break;
					}
				}
    		}
    	}		
	}

	function change_mode(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		if(data.mode === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

    		get_roominfo(socket.room, {mode:true}, function(info)
    		{
    			if(socket.priv === 'admin' || socket.priv === 'op')
    			{
    				var amodes = [1,2,3];

    				if(!isNaN(data.mode))
    				{
    					var m = parseInt(data.mode);

    					if(amodes.indexOf(m) != -1)
    					{
							io.sockets.in(socket.room).emit('update', {type:'mode_change', username:socket.username, mode:m});
							info.mode = m;
							
							db.collection('rooms').update({_id:info._id}, {$set:{mode:info.mode}});
    					}
    				}
    			}
    		});
    	}		
	}

	function make_private(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		get_roominfo(socket.room, {public:true}, function(info)
    		{
    			if(socket.priv === 'admin' || socket.priv === 'op')
    			{
    				if(info.public)
    				{
						io.sockets.in(socket.room).emit('update', {type:'made_private', username:socket.username});
	    				info.public = false;

	    				db.collection('rooms').update({_id:info._id}, {$set:{public:info.public}});
    				}
    			}
    		});
    	}
	}

	function make_public(socket, data)
	{
    	if(socket.username !== undefined)
    	{
    		get_roominfo(socket.room, {public:true}, function(info)
    		{
    			if(socket.priv === 'admin' || socket.priv === 'op')
    			{
    				if(!info.public)
    				{
						io.sockets.in(socket.room).emit('update', {type:'made_public', username:socket.username});
	    				info.public = true;

	    				db.collection('rooms').update({_id:info._id}, {$set:{public:info.public}});
    				}
    			}
    		});
    	}
	}

	function change_radiosrc(socket, data)
	{
    	if(socket.username !== undefined)
    	{
			if(data.src === undefined)
		    {
	    		socket.disconnect();
	    		return false;
		    }

	    	if(data.src.length === 0)
		    {
	    		socket.disconnect();
	    		return false;
		    }

    		get_roominfo(socket.room, {radiosrc:true}, function(info)
    		{
    			if(socket.priv === 'admin' || socket.priv === 'op')
    			{
    				var src = clean_string2(data.src).substring(0, 200);

    				if(src.length == 0)
    				{
    					return false;
    				}

    				if(src == 'default')
    				{
    					info.radiosrc = '';
    				}

    				else
    				{
	    				info.radiosrc = src;
    				}

					io.sockets.in(socket.room).emit('update', {type:'changed_radiosrc', username:socket.username, src:info.radiosrc});

					db.collection('rooms').update({_id:info._id}, {$set:{radiosrc:info.radiosrc}});
    			}
    		});
    	}		
	}

	function do_disconnect(socc)
	{
		socc.disconnect();
	}

	function disconnect(socket)
	{
		if(socket.username !== undefined)
		{
			if(socket.kickd)
			{
		   		var type = 'kicked';
			}
			else if(socket.bannd)
			{
				var type = 'banned';
			}
			else
			{
				var type = 'disconnection';
			}

			io.sockets.in(socket.room).emit('update', {type:type, username:socket.username, usercount:get_usercount(socket.room), info1:socket.info1})	
		}		
	}

	// Helper Functions

	function compare_roomlist(a, b)
	{
		if(a[2] < b[2])
		{
			return 1;
		}

		if(a[2] > b[2])
		{
	    	return -1;
		}

		return 0;
	}

	function get_roominfo(room, fields, callback)
	{
		db.collection('rooms').findOne({name:room}, fields, function(err, roominfo)
		{
			if(!roominfo)
			{
				roominfo = {
					name: room,
					image_url: '',
					image_uploader: '',
					topic: '',
					claimed: false,
					keys: '',
					mode: 1,
					radiosrc: '',
					bans: '',
					modified: 0,
					public: true
				}

				db.collection('rooms').insertOne(
					roominfo
				);
			}

			callback(roominfo);
		});
	}

	function get_userinfo(username, callback)
	{
		db.collection('users').findOne({username:username}, function(err, userinfo)
		{
			if(!userinfo)
			{
				userinfo = {
					username: username,
					password: ''
				}

				db.collection('users').insertOne(
					userinfo
				);
			}

			callback(userinfo);
		});
	}

	function get_usernames(room)
	{
		try
		{
			var sockets = io.sockets.adapter.rooms[room].sockets;

			var usernames = [];

			var keys = Object.keys(sockets);

			for(var i=0; i<keys.length; i++)
			{
				usernames.push(io.sockets.connected[keys[i]].username);
			}

			return usernames;
		}
		catch(err)
		{
			return [];
		}
	}

	function get_userlist(room)
	{
		try
		{
			var sockets = io.sockets.adapter.rooms[room].sockets;

			var userlist = [];

			var keys = Object.keys(sockets);

			for(var i=0; i<keys.length; i++)
			{
				var socc = io.sockets.connected[keys[i]];
				userlist.push([socc.username, socc.priv]);
			}

			return userlist;
		}
		catch(err)
		{
			return [];
		}
	}

	function get_roomlist(callback)
	{
		if(last_roomlist === undefined || (Date.now() - roomlist_lastget > 300000))
		{
		    var rooms = [];

		    var md = Date.now() - 86400000;

			db.collection('rooms').find({claimed:true, public:true, modified:{$gt:md}}).toArray(function(err, results)
			{
				for(var i=0; i<results.length; i++)
				{
					var room = results[i];

					rooms.push([room.name, room.topic.substring(0,140), get_usercount(room.name)]);
				}

				rooms.sort(compare_roomlist).splice(50);

				last_roomlist = rooms;
				roomlist_lastget = Date.now();

				callback(last_roomlist);
			});
		}
		else
		{
			callback(last_roomlist)
		}
	}

	function get_usercount(room)
	{
		try 
		{
			return Object.keys(io.sockets.adapter.rooms[room].sockets).length;
		}
		catch(err) 
		{
			return 0;
		}
	}

	function change_image(room, fname, uploader)
	{
		var pth = '/img/' + fname
		
		get_roominfo(room, {image_url:true}, function(info)
		{
			if(info.image_url.indexOf('default.gif') === -1)
			{
				var rname = info.image_url.split('_')[0].split('/').pop();

				exec("find " + images_root + " -maxdepth 1 -type f -name '" + rname + "_*' -not -name '" + fname + "' -delete", function(status, output)
				{
					info.image_url = pth;
					info.image_uploader = uploader;
					io.sockets.in(room).emit('update', {type:'image_change', image_url:info.image_url, image_uploader:info.image_uploader})
					
					db.collection('rooms').update({_id:info._id}, {$set:{image_url:info.image_url, image_uploader:info.image_uploader, modified:Date.now()}});
				});
			}
			else
			{
				info.image_url = pth;
				info.image_uploader = uploader;
				io.sockets.in(room).emit('update', {type:'image_change', image_url:info.image_url, image_uploader:info.image_uploader})
				
				db.collection('rooms').update({_id:info._id}, {$set:{image_url:info.image_url, image_uploader:info.image_uploader, modified:Date.now()}});
			}
		});
	}

	function check_image_url(uri)
	{
		if(uri.split(' ').length > 1)
		{
			return false;
		}

		var ext = uri.split('.').pop();

		if(ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'gif' && ext !== 'JPG' && ext !== 'PNG' && ext !== 'JPEG' && ext !== 'GIF')
		{
			return false;
		}

		return true;
	}

	function clean_string(s)
	{
		return s.replace(/</g, '').trim().replace(/\s+/g, ' ');
	}

	function clean_string2(s)
	{
		return s.trim().replace(/\s+/g, ' ');
	}

	function get_random_int(min, max)
	{
	    return Math.floor(Math.random() * (max-min+1) + min);
	}

	function get_random_key()
	{
	    var text = "";
	    var possible = "ABCDEFGHIJKLMnopqrstuvwxyz012345";

	    for(var i=0; i < 12; i++)
	    {
	    	text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }

	    return "_key_" + Date.now() + text;
	}

	function get_random_vkey()
	{
		var text = "";
		var possible = "NOPQRSTUVWXYZabcdefghijklm6789";

		for(var i=0; i < 12; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return "_vkey_" + Date.now() + text;
	}

	function get_random_okey()
	{
		var text = "";
		var possible = "NOPQRSTUVWXYZabcdefghijklm6789";

		for(var i=0; i < 6; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		possible = "ABCDEFGHIJKLMnopqrstuvwxyz012345";

		for(var i=0; i < 6; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return "_okey_" + Date.now() + text;
	}

	function get_random_ukey()
	{
	    var text = "";
	    var possible = "ABCDEFGHIJKLMnopqrstuvwxyz012345";

	    for(var i=0; i < 12; i++)
	    {
	    	text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }

	    return "_ukey_" + Date.now() + text;
	}

	function replace_key(priv, okey, keys)
	{
		if(okey !== '')
		{
			keys = remove_key(okey, keys);
		}

		if(priv === 'admin')
		{
			var key = get_random_key();
		}
		else if(priv === 'op')
		{
			var key = get_random_okey();
		}
		else if(priv === 'voice')
		{
			var key = get_random_vkey();
		}

		if(keys === '')
		{
			keys = key;
		}
		else
		{
			keys += ";" + key;
		}

		return {key:key, keys:keys};
	}

	function remove_key(key, keys)
	{
		var skeys = keys.split(';');

		for(var i=0; i<skeys.length; i++)
		{
			if(skeys[i] === key)
			{
				skeys.splice(i, 1);
				break;
			}
		}

		return skeys.join(';');
	}

	function make_username_unique(username, usernames)
	{
		var keep_going = true;
		var matched = false;
		while(keep_going)
		{
			for(var i = 0; i < usernames.length; i++)
			{
				if(usernames[i] === username)
				{
					matched = true;
					break;
				}
			}
			if(matched)
			{
				username = username + get_random_int(2, 9);
				keep_going = true;
				matched = false;
			}
			else
			{
				keep_going = false;
			}
		}
		return username;
	}

	function remove_username(username, usernames)
	{
		for(var i = 0; i < usernames.length; i++)
		{
			if(usernames[i] === username)
			{
				usernames.splice(i, 1);
			}
		}
	}
}