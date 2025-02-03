#!/usr/bin/env python

import yaml
import sys

def update_register_code(file_path, register_code_value):
    """
    Updates the 'register_code' property in a YAML file.

    Args:
        file_path (str): The path to the YAML file.
        register_code_value (bool): The value to set for 'register_code' (True or False).
    """
    try:
        with open(file_path, 'r') as f:
            config = yaml.safe_load(f)
    except FileNotFoundError:
        print(f"Error: File not found: {file_path}")
        return
    except yaml.YAMLError as e:
         print(f"Error: Could not parse YAML file: {e}")
         return

    if config is None:
        print("Error: YAML file is empty or invalid.")
        return

    if 'register_code' in config:
        config['register_code'] = register_code_value
    else:
         print("Error: 'register_code' property not found in the YAML file.")
         return

    try:
        with open(file_path, 'w') as f:
            yaml.dump(config, f, sort_keys=False)
        print(f"Successfully updated 'register_code' to {register_code_value} in {file_path}")
    except IOError as e:
        print(f"Error: Could not write to file: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <true|false>")
        sys.exit(1)

    register_code_arg = sys.argv[1].lower()

    if register_code_arg == "true":
         register_code_value = True
    elif register_code_arg == "false":
        register_code_value = False
    else:
        print("Invalid argument. Please use 'true' or 'false'.")
        sys.exit(1)

    file_path = "config/user_config.secret.yml"
    update_register_code(file_path, register_code_value)