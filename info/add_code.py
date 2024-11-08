#!/usr/bin/env python3

import sys
import json
import os

def main():
    if len(sys.argv) < 2:
        raise ValueError("The code must be provided as an argument.")

    new_code = sys.argv[1]
    file_path = "hue/config/codes.json"

    if not new_code:
        raise ValueError("The code cannot be empty.")

    if not os.path.exists(file_path):
        data = []
    else:
        try:
            with open(file_path, "r") as file:
                data = json.load(file)
                if not isinstance(data, list):
                    raise ValueError("The JSON data is not an array.")
        except json.JSONDecodeError:
            raise ValueError("The file does not contain valid JSON data.")

    data.append(new_code)

    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)

if __name__ == "__main__":
    main()