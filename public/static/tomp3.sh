#!/bin/bash

for FILE in audioclip/*.wav; do   
  echo -e "Processing file '$FILE'";
  ffmpeg -loglevel error -i "${FILE}" -vn -ab 256k -ar 44100 -y "${FILE%.wav}.mp3";
done;

for FILE in audioclip/*.flac; do   
  echo -e "Processing file '$FILE'";
  ffmpeg -loglevel error -i "${FILE}" -vn -ab 256k -ar 44100 -y "${FILE%.flac}.mp3";
done;

for FILE in audioclip/*.ogg; do   
  echo -e "Processing file '$FILE'";
  ffmpeg -loglevel error -i "${FILE}" -vn -ab 256k -ar 44100 -y "${FILE%.ogg}.mp3";
done;