FROM node:10.16.3-alpine as node
COPY . /shlink-web-client
RUN cd /shlink-web-client && npm install && npm run build

FROM nginx:1.17.3-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"

RUN sed -i 's/index\ \ index.html\ index.htm/try_files\ \$uri\/\ \$uri\/ \/index.html\ \/index.htm/g' /etc/nginx/conf.d/default.conf
RUN rm -r /usr/share/nginx/html
COPY --from=node /shlink-web-client/build /usr/share/nginx/html
