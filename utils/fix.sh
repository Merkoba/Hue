#!/usr/bin/env bash

npm run --silent lint public/static/assets/js/main/*.js
npm run --silent lint public/static/assets/js/libs/utilz.js
npm run --silent lint server/sockets/modules/*.js