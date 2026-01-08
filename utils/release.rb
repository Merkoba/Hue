#!/usr/bin/env ruby
require "git"

# 1. Get or Create Tag
repo = Git.open(".")

current_commit = repo.log.first.sha
tag_name = nil

repo.tags.each do |tag|
  if tag.sha == current_commit
    tag_name = tag.name
    break
  end
end

if tag_name.nil?
  print "No tag found at current commit. Enter new tag name (e.g. v1.2.3): "
  input = STDIN.gets&.strip

  if input.nil? || input.empty?
    abort "Error: Tag name cannot be empty."
  end

  if repo.tags.map(&:name).include?(input)
    abort "Error: Tag '#{input}' already exists."
  end

  puts "Creating tag #{input} at current commit..."
  repo.add_tag(input)

  if system("git push origin #{input}")
    puts "Pushed tag #{input} to origin."
  else
    puts "Warning: Failed to push tag '#{input}' to origin. Continuing without pushing."
  end

  tag_name = input
else
  puts "Using current tag: #{tag_name}"
end

# 2. Create GitHub Release
puts "Creating GitHub Release for #{tag_name}..."

# --generate-notes autocompiles the changes based on PRs/commits
command = "gh release create #{tag_name} --title \"#{tag_name}\" --generate-notes"

if system(command)
  puts "Successfully created GitHub release: #{tag_name}"
else
  abort "Error: Failed to create release. Make sure 'gh' CLI is installed and you are logged in."
end