#! /bin/bash
SITE_PATH='../set-back-end'
cd $SITE_PATH
echo "SYNC the Repository"
git reset --hard origin/master
git clean -f
git pull
git checkout master
echo "DEPLOY the server"
docker restart set-dl-server
docker exec set-dl-server bash -c 'rm -rf /app/set-dl-server'
docker cp . set-dl-server:/app/set-dl-server
docker exec set-dl-server bash -c 'cd set-dl-server; cnpm install'
docker exec set-dl-server bash -c 'cd set-dl-server; pm2 startOrRestart ./deploy/test.json'
