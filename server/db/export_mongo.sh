#!/bin/bash
mongoexport --collection=users --db=hue --out=users.txt
mongoexport --collection=rooms --db=hue --out=rooms.txt