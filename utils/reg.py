#!/usr/bin/env python

import yaml
import sys
import os

# Get the value from command line argument (True or False)
value = False  # Default value if no argument is provided
if len(sys.argv) > 1:
    value = bool(sys.argv[1])  # Convert to boolean

# Construct file path
file_path = os.path.join('config', 'user_config.secret.yml')

# Read the YAML file
try:
    with open(file_path, 'r') as file:
        current_config = yaml.safe_load(file)
except FileNotFoundError:
    # If file doesn't exist, create it
    with open(file_path, 'w') as file:
        yaml.dump({'system': {'register_code': value}}, file)
else:
    # Modify or add the register_code
    if 'system' not in current_config:
        current_config['system'] = {}
    current_config['system']['register_code'] = value
    # Write back to file
    with open(file_path, 'w') as file:
        yaml.dump(current_config, file)