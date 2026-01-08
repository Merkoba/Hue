#!/usr/bin/env ruby
require "git"

# 1. Get Current Tag
repo = Git.open(".")

# Get the tag pointing to the current HEAD
current_commit = repo.log.first.sha
tag_name = nil

repo.tags.each do |tag|
  if tag.sha == current_commit
    tag_name = tag.name
    break
  end
end

if tag_name.nil?
  abort "Error: No tag found at current commit. Create a tag first with: git tag <version>"
end

puts "Using current tag: #{tag_name}"

# 2. Create GitHub Release
puts "Creating GitHub Release for #{tag_name}..."

# --generate-notes autocompiles the changes based on PRs/commits
command = "gh release create #{tag_name} --title \"#{tag_name}\" --generate-notes"

if system(command)
  puts "Successfully created GitHub release: #{tag_name}"
else
  abort "Error: Failed to create release. Make sure 'gh' CLI is installed and you are logged in."
end