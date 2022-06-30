#!/usr/bin/env bash
eslint -c eslint.json .
eslint -c eslint.json --no-ignore public/static/assets/js/libs/utilz.js
eslint -c eslint.json --no-ignore public/static/assets/js/libs/colorlib.js
eslint -c eslint.json --no-ignore public/static/assets/js/libs/msg.js