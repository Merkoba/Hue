#!/usr/bin/env bash

npx eslint --fix -c eslint.config.mjs public/static/assets/js/main/*.js
npx eslint --fix -c eslint.config.mjs public/static/assets/js/libs/utilz.js
npx eslint --fix -c eslint.config.mjs server/sockets/modules/*.js