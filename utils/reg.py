#!/usr/bin/env python

import yaml
import sys


def update_use_register_code(file_path, use_register_code_value):
    """
    Updates the 'use_use_register_code' property in a YAML file.

    Args:
        file_path (str): The path to the YAML file.
        use_register_code_value (bool): The value to set for 'use_register_code' (True or False).
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

    if 'use_register_code' in config:
        config['use_register_code'] = use_register_code_value
    else:
         print("Error: 'use_register_code' property not found in the YAML file.")
         return

    try:
        with open(file_path, 'w') as f:
            yaml.dump(config, f, sort_keys=False)
        print(f"Successfully updated 'use_register_code' to {use_register_code_value} in {file_path}")
    except IOError as e:
        print(f"Error: Could not write to file: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <true|false>")
        sys.exit(1)

    use_register_code_arg = sys.argv[1].lower()

    if use_register_code_arg == "true":
         use_register_code_value = True
    elif use_register_code_arg == "false":
        use_register_code_value = False
    else:
        print("Invalid argument. Please use 'true' or 'false'.")
        sys.exit(1)

    file_path = "config/user_config.secret.yml"
    update_use_register_code(file_path, use_register_code_value)