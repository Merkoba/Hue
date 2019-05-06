module.exports = function(vars, manager, db, config, sconfig, utilz, logger)
{
    // Initial declarations
    vars.fs = require('fs')
    vars.path = require('path')
    vars.mongo = require('mongodb')
    vars.bcrypt = require('bcrypt')
    vars.mailgun = require('mailgun-js')({apiKey: sconfig.mailgun_api_key, domain: sconfig.mailgun_domain})
    vars.reserved_usernames = ["The system", config.image_ads_setter].map(x => x.toLowerCase())

    // Room and User versions
    // These must be increased by 1 when the schema changes
    vars.rooms_version = 75
    vars.users_version = 46

    // Room schema definition
    // This is used to check types and fill defaults
    vars.rooms_schema =
    {
        name:{type:"string", default:"No Name"},
        topic:{type:"string", default:""},
        topic_setter:{type:"string", default:""},
        topic_date:{type:"number", default:0},
        keys:{type:"object", default:{}},
        stored_images:{type:"object", default:[]},
        images_mode:{type:"string", default:"enabled"},
        image_id:{type:"string", default:""},
        image_user_id:{type:"string", default:""},
        image_source:{type:"string", default:""},
        image_setter:{type:"string", default:""},
        image_size:{type:"number", default:0},
        image_date:{type:"number", default:0},
        image_query:{type:"string", default:""},
        image_type:{type:"string", default:"link"},
        image_comment:{type:"string", default:""},
        radio_id:{type:"string", default:""},
        radio_user_id:{type:"string", default:""},
        radio_type:{type:"string", default:"radio"},
        radio_source:{type:"string", default:""},
        radio_title:{type:"string", default:""},
        radio_setter:{type:"string", default:""},
        radio_date:{type:"number", default:0},
        radio_query:{type:"string", default:""},
        radio_comment:{type:"string", default:""},
        tv_id:{type:"string", default:""},
        tv_user_id:{type:"string", default:""},
        tv_type:{type:"string", default:"tv"},
        tv_source:{type:"string", default:""},
        tv_title:{type:"string", default:""},
        tv_setter:{type:"string", default:""},
        tv_date:{type:"number", default:0},
        tv_query:{type:"string", default:""},
        tv_comment:{type:"string", default:""},
        tv_mode:{type:"string", default:"enabled"},
        radio_mode:{type:"string", default:"enabled"},
        synth_mode:{type:"string", default:"enabled"},
        bans:{type:"object", default:[]},
        log:{type:"boolean", default:true},
        log_messages:{type:"object", default:[]},
        admin_log_messages:{type:"object", default:[]},
        access_log_messages:{type:"object", default:[]},
        theme_mode:{type:"string", default:"custom"},
        theme:{type:"string", default:"#4d458c"},
        background_image:{type:"string", default:""},
        background_image_setter:{type:"string", default:""},
        background_image_date:{type:"number", default:0},
        background_image_type:{type:"string", default:"hosted"},
        background_mode:{type:"string", default:"normal"},
        background_effect:{type:"string", default:"none"},
        background_tile_dimensions:{type:"string", default:"200px auto"},
        text_color_mode:{type:"string", default:"automatic"},
        text_color:{type:"string", default:"#cdcadf"},
        public:{type:"boolean", default:true},
        voice1_chat_permission:{type:"boolean", default:true},
        voice1_images_permission:{type:"boolean", default:true},
        voice1_tv_permission:{type:"boolean", default:true},
        voice1_radio_permission:{type:"boolean", default:true},
        voice1_synth_permission:{type:"boolean", default:true},
        voice2_chat_permission:{type:"boolean", default:true},
        voice2_images_permission:{type:"boolean", default:true},
        voice2_tv_permission:{type:"boolean", default:true},
        voice2_radio_permission:{type:"boolean", default:true},
        voice2_synth_permission:{type:"boolean", default:true},
        voice3_chat_permission:{type:"boolean", default:true},
        voice3_images_permission:{type:"boolean", default:true},
        voice3_tv_permission:{type:"boolean", default:true},
        voice3_radio_permission:{type:"boolean", default:true},
        voice3_synth_permission:{type:"boolean", default:true},
        voice4_chat_permission:{type:"boolean", default:true},
        voice4_images_permission:{type:"boolean", default:true},
        voice4_tv_permission:{type:"boolean", default:true},
        voice4_radio_permission:{type:"boolean", default:true},
        voice4_synth_permission:{type:"boolean", default:true},
        modified:{type:"number", default:Date.now()}
    }

    // User schema definition
    // This is used to check types and fill defaults
    vars.users_schema =
    {
        username:{type:"string", default:"", skip:true},
        password:{type:"string", default:"", skip:true},
        email:{type:"string", default:"", skip:true},
        password_date:{type:"number", default:0},
        password_reset_code:{type:"string", default:""},
        password_reset_date:{type:"number", default:0},
        password_reset_link_date:{type:"number", default:0},
        visited_rooms:{type:"object", default:[]},
        profile_image:{type:"string", default:""},
        profile_image_version:{type:"number", default:0},
        verified:{type:"boolean", default:false},
        verification_code:{type:"string", default:""},
        registration_date:{type:"number", default:0},
        email_change_code:{type:"string", default:""},
        email_change_date:{type:"number", default:0},
        email_change_code_date:{type:"number", default:0},
        create_room_date:{type:"number", default:0},
        bio:{type:"string", default:""},
        hearts:{type:"number", default:0},
        skulls:{type:"number", default:0},
        modified:{type:"number", default:Date.now()}
    }
}