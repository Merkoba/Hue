#!/usr/bin/env bash

export NODE_OPTIONS="--no-warnings"

npx eslint --cache public/static/assets/js/main/*.js
npx eslint --cache public/static/assets/js/libs/utilz.js
npx eslint --cache server/sockets/modules/*.js