FROM node:18.13.0-alpine as angular
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . .
RUN npm i net -S
RUN npm run build

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=angular app/dist/pilacoin/browser /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
