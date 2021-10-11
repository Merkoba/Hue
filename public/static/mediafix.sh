#!/bin/bash
mv _img assets

mv img image
mv image/profile profilepic
mv image/background background
mv image/room/* image/
rm -R image/room

mv video tv
mv tv/room/* tv/
rm -R tv/room

mv audio audioclip