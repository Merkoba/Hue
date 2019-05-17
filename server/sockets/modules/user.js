module.exports = function(handler, vars, io, db_manager, config, sconfig, utilz, logger)
{
    // Changes usernames
    handler.public.change_username = async function(socket, data)
    {
        if(data.username === undefined)
        {
            return handler.get_out(socket)
        }

        if(data.username.length === 0)
        {
            return handler.get_out(socket)
        }

        if(data.username.length > config.max_username_length)
        {
            return handler.get_out(socket)
        }

        if(utilz.clean_string4(data.username) !== data.username)
        {
            return handler.get_out(socket)
        }

        let old_username = socket.hue_username
        let done = await db_manager.change_username(socket.hue_user_id, data.username)

        if(done)
        {
            handler.modify_socket_properties(socket, {hue_username:data.username},
            {
                method: "new_username",
                data:
                {
                    username: data.username,
                    old_username: old_username
                }
            })
        }

        else
        {
            handler.user_emit(socket, 'username_already_exists', {username:data.username})
        }
    }

    // Changes passwords
    handler.public.change_password = function(socket, data)
    {
        if(data.password === undefined)
        {
            return handler.get_out(socket)
        }

        if(data.password.length === 0 || data.password.length < config.min_password_length)
        {
            return handler.get_out(socket)
        }

        if(data.password.length > config.max_password_length)
        {
            return handler.get_out(socket)
        }

        db_manager.update_user(socket.hue_user_id,
        {
            password: data.password,
            password_date: Date.now()
        })

        handler.user_emit(socket, 'password_changed', {password:data.password})
    }

    // Changes emails
    handler.public.change_email = async function(socket, data)
    {
        if(data.email === undefined)
        {
            return handler.get_out(socket)
        }

        if(!data.email.includes('@') || data.email.includes(' '))
        {
            return handler.get_out(socket)
        }

        if(data.email.length > config.max_email_length)
        {
            return handler.get_out(socket)
        }

        if(utilz.clean_string5(data.email) !== data.email)
        {
            return handler.get_out(socket)
        }

        let ans = await db_manager.change_email(socket.hue_user_id, data.email)

        if(ans.message === "error")
        {
            handler.user_emit(socket, 'error_occurred', {})
            return
        }

        else if(ans.message === "duplicate")
        {
            handler.user_emit(socket, 'email_already_exists', {email:data.email})
            return
        }

        else if(ans.message === "wait")
        {
            handler.user_emit(socket, 'email_change_wait', {})
            return
        }

        else if(ans.message === "sent_code")
        {
            handler.user_emit(socket, 'email_change_code_sent', {email:data.email})
            return
        }
    }

    // Handles email verification codes
    handler.public.verify_email = async function(socket, data)
    {
        if(utilz.clean_string5(data.code) !== data.code)
        {
            return handler.get_out(socket)
        }

        if(data.code.length === 0)
        {
            return handler.get_out(socket)
        }

        if(data.code.length > config.email_change_code_max_length)
        {
            return handler.get_out(socket)
        }

        let ans = await db_manager.change_email(socket.hue_user_id, data.email, data.code)

        if(ans.message === "error")
        {
            handler.user_emit(socket, 'error_occurred', {})
            return
        }

        else if(ans.message === "duplicate")
        {
            handler.user_emit(socket, 'email_already_exists', {email:data.email})
            return
        }

        else if(ans.message === "not_sent")
        {
            handler.user_emit(socket, 'email_change_code_not_sent', {email:data.email})
            return
        }

        else if(ans.message === "wrong_code")
        {
            handler.user_emit(socket, 'email_change_wrong_code', {email:data.email})
            return
        }

        else if(ans.message === "expired_code")
        {
            handler.user_emit(socket, 'email_change_expired_code', {email:data.email})
            return
        }

        else if(ans.message === "changed")
        {
            handler.modify_socket_properties(socket, {hue_email:data.email})
            handler.user_emit(socket, 'email_changed', {email:ans.email})
        }
    }

    // Handles bio changes
    handler.public.change_bio = async function(socket, data)
    {
        if(data.bio.length > config.max_bio_length)
        {
            return handler.get_out(socket)
        }
        
        if(data.bio.split("\n").length > config.max_bio_lines)
        {
            return handler.get_out(socket)
        }

        if(data.bio !== utilz.clean_string12(data.bio))
        {
            return handler.get_out(socket)
        }

        if(socket.hue_bio === data.bio)
        {
            return false
        }

        handler.modify_socket_properties(socket, {hue_bio:data.bio})

        await db_manager.update_user(socket.hue_user_id,
        {
            bio: socket.hue_bio
        })

        handler.room_emit(socket, 'bio_changed',
        {
            username: socket.hue_username,
            bio: socket.hue_bio
        })
    }

    // Handles uploaded profile images
    handler.upload_profile_image = function(socket, data)
    {
        if(data.image_file === undefined)
        {
            return handler.get_out(socket)
        }

        let dimensions = vars.image_dimensions(data.image_file)

        if(dimensions.width !== config.profile_image_diameter || dimensions.height !== config.profile_image_diameter)
        {
            return handler.get_out(socket)
        }

        let size = data.image_file.byteLength / 1024

        if(size === 0 || (size > config.max_profile_image_size))
        {
            handler.user_emit(socket, 'upload_error', {})
            return false
        }

        let fname = `profile_${socket.hue_user_id}.jpg`

        vars.fs.writeFile(vars.images_root + '/' + fname, data.image_file, function(err, data)
        {
            if(err)
            {
                handler.user_emit(socket, 'upload_error', {})
            }

            else
            {
                handler.change_profile_image(socket, fname)
            }
        })
    }

    // Intermidiate step to change profile images
    handler.change_profile_image = function(socket, fname)
    {
        if(config.image_storage_s3_or_local === "local")
        {
            handler.do_change_profile_image(socket, fname)
        }

        else if(config.image_storage_s3_or_local === "s3")
        {
            vars.fs.readFile(`${vars.images_root}/${fname}`, (err, data) =>
            {
                if(err)
                {
                    vars.fs.unlink(`${vars.images_root}/${fname}`, function(){})
                    return
                }

                vars.s3.putObject(
                {
                    ACL: "public-read",
                    ContentType: handler.get_content_type(fname),
                    Body: data,
                    Bucket: sconfig.s3_bucket_name,
                    Key: `${sconfig.s3_images_location}${fname}`,
                    CacheControl: `max-age=${sconfig.s3_cache_max_age}`
                }).promise()

                .then(ans =>
                {
                    vars.fs.unlink(`${vars.images_root}/${fname}`, function(){})
                    handler.do_change_profile_image(socket, sconfig.s3_main_url + sconfig.s3_images_location + fname)
                })

                .catch(err =>
                {
                    vars.fs.unlink(`${vars.images_root}/${fname}`, function(){})
                    logger.log_error(err)
                })
            })
        }

        else
        {
            return false
        }
    }

    // Completes profile image changes
    handler.do_change_profile_image = async function(socket, fname)
    {
        let userinfo = await db_manager.get_user({_id:socket.hue_user_id}, {profile_image_version:1})
        let new_ver = userinfo.profile_image_version + 1
        let fver = `${fname}?ver=${new_ver}`
        let image_url

        if(config.image_storage_s3_or_local === "local")
        {
            image_url = config.public_images_location + fver
        }

        else if(config.image_storage_s3_or_local === "s3")
        {
            image_url = fver
        }

        let ans = await db_manager.update_user(socket.hue_user_id,
        {
            profile_image: fver,
            profile_image_version: new_ver
        })

        for(let room_id of vars.user_rooms[socket.hue_user_id])
        {
            for(let socc of handler.get_user_sockets_per_room(room_id, socket.hue_user_id))
            {
                socc.hue_profile_image = image_url
            }

            handler.update_user_in_userlist(socket)

            handler.room_emit(room_id, 'profile_image_changed',
            {
                username: socket.hue_username,
                profile_image: image_url
            })
        }
    }
}