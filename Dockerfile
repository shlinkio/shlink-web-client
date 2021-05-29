FROM node:14.15-alpine as node
COPY . /shlink-web-client
ARG VERSION="latest"
ENV VERSION ${VERSION}
RUN cd /shlink-web-client && \
    npm install && npm run build -- ${VERSION} --no-dist

FROM nginx:1.19.6-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY config/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY scripts/docker/servers.json_from_env.sh /docker-entrypoint.d/30-shlink-servers-json.sh
COPY --from=node /shlink-web-client/build /usr/share/nginx/html
