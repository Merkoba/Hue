#!/usr/bin/env ruby
require "git"

# 1. Get Latest Tag
repo = Git.open(".")

tags = repo.tags.map(&:name).sort_by { |t| Gem::Version.new(t.sub(/^v/, "")) rescue t }

if tags.empty?
  abort "Error: No tags found in repository. Create a tag first."
end

tag_name = tags.last

puts "Using latest tag: #{tag_name}"

# 2. Create GitHub Release
puts "Creating GitHub Release for #{tag_name}..."

# --generate-notes autocompiles the changes based on PRs/commits
command = "gh release create #{tag_name} --title \"#{tag_name}\" --generate-notes"

if system(command)
  puts "Successfully created GitHub release: #{tag_name}"
else
  abort "Error: Failed to create release. Make sure 'gh' CLI is installed and you are logged in."
end