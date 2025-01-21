module.exports = {
  apps : [{
    name: `hue_main`,
    script: `hue/server/www`,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: `1G`,
    env: {
      NODE_ENV: `production`,
    },
    env_production: {
      NODE_ENV: `production`,
    },
  }],
}
