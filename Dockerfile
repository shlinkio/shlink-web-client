FROM node:10.15.2 as node
COPY . /shlink-web-client
RUN cd /shlink-web-client && yarn install && yarn build

FROM nginx:1.15.9-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html
COPY --from=node /shlink-web-client/build /usr/share/nginx/html
