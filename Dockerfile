FROM node:12.11.1-alpine as node
COPY . /shlink-web-client
RUN cd /shlink-web-client && npm install && npm run build

FROM nginx:1.17.6-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY config/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /shlink-web-client/build /usr/share/nginx/html
