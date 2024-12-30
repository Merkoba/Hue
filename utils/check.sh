#!/usr/bin/env bash
export NODE_OPTIONS="--no-warnings"

# Only check files that have changed recently
last_tag=$(git describe --tags --abbrev=0)
changed_files=$(git diff --name-only $last_tag HEAD -- '*.js')

if [ -n "$changed_files" ]; then
  npx eslint --cache $changed_files
else
  echo "No files have changed since the last tag."
fi

# npx eslint --cache public/static/assets/js/main/*.js
# npx eslint --cache public/static/assets/js/libs/utilz.js
# npx eslint --cache server/sockets/modules/*.js