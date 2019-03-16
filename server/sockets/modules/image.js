module.exports = function(handler, vars, io, db_manager, config, sconfig, utilz, logger)
{
    // Handles image source changes
    handler.public.change_image_source = function(socket, data)
    {
        if(data.src === undefined)
        {
            return handler.get_out(socket)
        }

        if(data.src.length === 0)
        {
            return handler.get_out(socket)
        }

        if(data.src.length > config.max_image_source_length)
        {
            return handler.get_out(socket)
        }

        if(data.query)
        {
            if(data.query.length > config.safe_limit_1)
            {
                return handler.get_out(socket)
            }
        }

        if(data.comment)
        {
            if(data.comment.length > config.safe_limit_4)
            {
                return handler.get_out(socket)
            }
        }

        if(data.src !== utilz.clean_string2(data.src))
        {
            return handler.get_out(socket)
        }

        if(!handler.check_permission(socket, "images"))
        {
            return false
        }

        if(vars.rooms[socket.hue_room_id].current_image_source === data.src
        || vars.rooms[socket.hue_room_id].current_image_query === data.src)
        {
            handler.user_emit(socket, 'same_image', {})
            return false
        }

        if(Date.now() - vars.rooms[socket.hue_room_id].last_image_change < config.image_change_cooldown)
        {
            handler.user_emit(socket, 'image_cooldown_wait', {})
            return false
        }

        if(data.src === "default")
        {
            let obj = {}

            obj.src = "default"
            obj.setter = socket.hue_username
            obj.size = 0
            obj.type = "link"
            obj.comment = data.comment

            handler.change_image(socket, obj)

            return
        }

        else
        {
            data.src = data.src.replace(/\.gifv/g,'.gif')
        }

        if(!utilz.is_url(data.src) && !data.src.startsWith("/"))
        {
            if(!config.imgur_enabled)
            {
                return false
            }

            vars.fetch(`https://api.imgur.com/3/gallery/search/?q=${encodeURIComponent(data.src)}`,
            {
                headers:
                {
                    Authorization: `Client-ID ${sconfig.imgur_client_id}`
                }
            })

            .then(function(res)
            {
                return res.json()
            })

            .then(function(response)
            {
                if(!response.data || !Array.isArray(response.data))
                {
                    return false
                }

                for(let item of response.data)
                {
                    if(item)
                    {
                        if(item.type)
                        {
                            if(item.type.startsWith("image"))
                            {
                                let obj = {}
                                obj.query = data.src
                                obj.src = item.link
                                obj.setter = socket.hue_username
                                obj.size = 0
                                obj.type = "link"
                                obj.comment = data.comment

                                handler.change_image(socket, obj)

                                return
                            }
                        }

                        else if(item.images)
                        {
                            for(let img of item.images)
                            {
                                if(img.type.startsWith("image"))
                                {
                                    let obj = {}
                                    obj.query = data.src
                                    obj.src = img.link
                                    obj.setter = socket.hue_username
                                    obj.size = 0
                                    obj.type = "link"
                                    obj.comment = data.comment

                                    handler.change_image(socket, obj)

                                    return
                                }
                            }
                        }
                    }
                }

                handler.user_emit(socket, 'image_not_found', {})
            })

            .catch(err =>
            {
                logger.log_error(err)
            })
        }

        else
        {
            if(handler.check_domain_list("images", data.src))
            {
                return false
            }

            let extension = utilz.get_extension(data.src).toLowerCase()

            if(!extension || !utilz.image_extensions.includes(extension))
            {
                return false
            }

            let obj = {}

            obj.src = data.src
            obj.setter = socket.hue_username
            obj.size = 0
            obj.type = "link"
            obj.comment = data.comment

            handler.change_image(socket, obj)
        }
    }

    // Handles sliced image uploads
    handler.upload_image = function(socket, data)
    {
        if(data.image_file === undefined)
        {
            return handler.get_out(socket)
        }

        if(data.extension === undefined)
        {
            return handler.get_out(socket)
        }

        if(!handler.check_permission(socket, "images"))
        {
            return false
        }

        let size = data.image_file.byteLength / 1024

        if(size === 0 || (size > config.max_image_size))
        {
            return handler.get_out(socket)
        }

        let fname = `${socket.hue_room_id}_${Date.now()}_${utilz.get_random_int(0, 1000)}.${data.extension}`

        vars.fs.writeFile(vars.images_root + '/' + fname, data.image_file, function(err, data2)
        {
            if(err)
            {
                handler.user_emit(socket, 'upload_error', {})
            }

            else
            {
                let obj = {}

                obj.src = fname
                obj.setter = socket.hue_username
                obj.size = size
                obj.type = "upload"
                obj.comment = data.comment

                handler.change_image(socket, obj)
            }
        })
    }

    // Intermidiate step to change the image
    handler.change_image = function(socket, data)
    {
        if(data.type === "link")
        {
            handler.do_change_image_source(socket, data)
        }

        else if(data.type === "upload")
        {
            if(config.image_storage_s3_or_local === "local")
            {
                handler.do_change_image_source(socket, data)
            }

            else if(config.image_storage_s3_or_local === "s3")
            {
                vars.fs.readFile(`${vars.images_root}/${data.fname}`, (err, data2) =>
                {
                    if(err)
                    {
                        vars.fs.unlink(`${vars.images_root}/${data.fname}`, function(){})
                        logger.log_error(err)
                        return
                    }

                    vars.s3.putObject(
                    {
                        ACL: "public-read",
                        ContentType: handler.get_content_type(data.fname),
                        Body: data2,
                        Bucket: sconfig.s3_bucket_name,
                        Key: `${sconfig.s3_images_location}${data.fname}`,
                        CacheControl: `max-age=${sconfig.s3_cache_max_age}`
                    }).promise()

                    .then(ans =>
                    {
                        vars.fs.unlink(`${vars.images_root}/${data.fname}`, function(){})
                        data.fname = sconfig.s3_main_url + sconfig.s3_images_location + data.fname
                        handler.do_change_image_source(socket, data)
                    })

                    .catch(err =>
                    {
                        vars.fs.unlink(`${vars.images_root}/${data.fname}`, function(){})
                        logger.log_error(err)
                    })
                })
            }

            else
            {
                return false
            }
        }
    }

    // Completes image source changes
    handler.do_change_image_source = function(socket, data)
    {
        let room_id, user_id

        if(typeof socket === "object")
        {
            room_id = socket.hue_room_id
            user_id = socket.hue_user_id
        }

        else
        {
            room_id = socket
            user_id = "none"
        }

        let image_source
        let date = Date.now()
        let comment = data.comment || ""
        let size = data.size || 0

        if(data.query === undefined)
        {
            data.query = ""
        }

        if(!data.type)
        {
            data.type = "link"
        }

        if(!data.setter)
        {
            user_id = ""
        }

        let image_id = handler.generate_message_id()

        if(data.type === "link")
        {
            image_source = data.src

            if(image_source === 'default')
            {
                image_source = ""
                data.query = "default"
            }

            db_manager.update_room(room_id,
            {
                image_id: image_id,
                image_user_id: user_id,
                image_source: image_source,
                image_setter: data.setter,
                image_size: size,
                image_date: date,
                image_type: data.type,
                image_query: data.query,
                image_comment: comment
            })
        }

        else if(data.type === "upload")
        {
            if(config.image_storage_s3_or_local === "local")
            {
                image_source = config.public_images_location + data.src
            }

            else if(config.image_storage_s3_or_local === "s3")
            {
                image_source = data.src
            }

            else
            {
                return false
            }

            vars.rooms[room_id].stored_images.unshift(data.src)

            let spliced = false

            if(vars.rooms[room_id].stored_images.length > config.max_stored_images)
            {
                spliced = vars.rooms[room_id].stored_images.splice(config.max_stored_images, vars.rooms[room_id].stored_images.length)
            }

            db_manager.update_room(room_id,
            {
                image_id: image_id,
                image_user_id: user_id,
                image_source: image_source,
                image_setter: data.setter,
                image_size: size,
                image_date: date,
                stored_images: vars.rooms[room_id].stored_images,
                image_type: data.type,
                image_query: data.query,
                image_comment: comment
            })

            if(spliced)
            {
                for(let file_name of spliced)
                {
                    if(!file_name.includes(sconfig.s3_main_url))
                    {
                        vars.fs.unlink(`${vars.images_root}/${file_name}`, function(err){})
                    }

                    else
                    {
                        vars.s3.deleteObject(
                        {
                            Bucket: sconfig.s3_bucket_name,
                            Key: file_name.replace(sconfig.s3_main_url, "")
                        }).promise()

                        .catch(err =>
                        {
                            logger.log_error(err)
                        })
                    }
                }
            }
        }

        else
        {
            return false
        }

        if(image_source === undefined)
        {
            return false
        }

        handler.room_emit(room_id, 'changed_image_source',
        {
            id: image_id,
            user_id: user_id,
            source: image_source,
            setter: data.setter,
            size: size,
            date: date,
            type: data.type,
            query: data.query,
            comment: comment
        })

        if(vars.rooms[room_id].log)
        {
            let message =
            {
                id: image_id,
                type: "image",
                date: date,
                data:
                {
                    user_id: user_id,
                    comment: comment,
                    source: image_source,
                    setter: data.setter,
                    size: size,
                    type: data.type,
                    query: data.query
                }
            }

            handler.push_log_message(socket, message)
        }

        vars.rooms[room_id].current_image_id = image_id
        vars.rooms[room_id].current_image_user_id = user_id
        vars.rooms[room_id].current_image_source = image_source
        vars.rooms[room_id].current_image_query = data.query
        vars.rooms[room_id].last_image_change = Date.now()
        vars.rooms[room_id].modified = Date.now()
    }

    // Handles images mode changes
    handler.public.change_images_mode = function(socket, data)
    {
        if(!handler.is_admin_or_op(socket))
        {
            return handler.get_out(socket)
        }

        if(data.what !== "enabled" && data.what !== "disabled" && data.what !== "locked")
        {
            return handler.get_out(socket)
        }

        vars.rooms[socket.hue_room_id].images_mode = data.what

        db_manager.update_room(socket.hue_room_id,
        {
            images_mode: data.what
        })

        handler.room_emit(socket, 'room_images_mode_change',
        {
            what: data.what,
            username: socket.hue_username
        })

        handler.push_admin_log_message(socket, `changed the image mode to "${data.what}"`)
    }

    // Returns an image mime type by checking the extension
    handler.get_content_type = function(fname)
    {
        if(typeof fname !== "string")
        {
            return "image/jpeg"
        }

        if(fname.length === 0)
        {
            return "image/jpeg"
        }

        let split = fname.split('.')
        let ext = split[split.length - 1]

        if(ext === "jpg" || ext === "jpeg")
        {
            return "image/jpeg"
        }

        else if(ext === "png")
        {
            return "image/png"
        }

        else if(ext === "gif")
        {
            return "image/gif"
        }

        else
        {
            return "image/jpeg"
        }
    }
}