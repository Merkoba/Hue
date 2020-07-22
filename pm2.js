module.exports = {
  apps : [
      {
        name: "hue",
        script: "./server/www",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}
