#!/usr/bin/env bash

files=$(git ls-files -- "*.js")
files=$(echo $files | tr " " "\n" | grep -v ".bundle." | tr "\n" " ")
files=$(echo $files | tr " " "\n" | grep -v "/libs/" | tr "\n" " ")

total_lines=0

for file in $files; do
  lines=$(wc -l < "$file")
  total_lines=$((total_lines + lines))
done

echo "Total JS Lines: $total_lines"

files=$(git ls-files -- "*.css")
files=$(echo $files | tr " " "\n" | grep -v ".bundle." | tr "\n" " ")
files=$(echo $files | tr " " "\n" | grep -v "/libs/" | tr "\n" " ")

total_lines=0

for file in $files; do
  lines=$(wc -l < "$file")
  total_lines=$((total_lines + lines))
done

echo "Total CSS Lines: $total_lines"