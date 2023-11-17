FROM node:latest as angular
WORKDIR /app
COPY package.json /app
RUN npm install --legacy-peer-deps
RUN npm install nginx
RUN npm run build
COPY . .

VOLUME /var/cache/nginx
COPY /dist/pilacoin /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
