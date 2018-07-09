#!/bin/bash
docker stop set-dl-server
docker rm set-dl-server
docker build -t ea-pm2 . -f ./pm2.dockerfile
docker run -p 8888:8888 --name set-dl-server -dit ea-pm2
# docker save ea-pm2 |bzip2 -9 -c > pm2_docker_img.tar.bz2
#  bzip2 -d -c < pm2_docker_img.tar.bz2 |docker load
sh ./load.sh