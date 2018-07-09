FROM ubuntu:18.04

RUN apt-get -y update
RUN apt-get -y install npm
RUN apt-get -y install curl
RUN npm install cnpm -g --registry=https://registry.npm.taobao.org
RUN cnpm install n -g
RUN n 10
RUN cnpm install pm2 -g
RUN mkdir -p /app
WORKDIR /app
EXPOSE 8888
CMD ["/bin/bash"]