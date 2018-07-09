#!/bin/bash
#docker exec set-dl-server bash -c 'rm -rf /app/set-dl-server'
docker cp . set-dl-server:/app/set-dl-server/
docker exec set-dl-server bash -c 'cd set-dl-server; cnpm install'
docker exec set-dl-server bash -c 'cd set-dl-server; pm2 startOrRestart ./deploy/test.json'
