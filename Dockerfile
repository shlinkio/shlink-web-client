FROM node:24.6-alpine AS node
COPY . /shlink-web-client
ARG VERSION="latest"
ENV VERSION=${VERSION}
RUN cd /shlink-web-client && npm ci && node --run build

FROM nginxinc/nginx-unprivileged:1.29-alpine
ARG UID=101
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"

USER root
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY config/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY scripts/docker/servers_from_env.sh /docker-entrypoint.d/30-shlink-servers-json.sh
COPY --from=node /shlink-web-client/build /usr/share/nginx/html

# This is required by 30-shlink-servers-json.sh to be writable for UID
RUN echo '[]' > /usr/share/nginx/html/servers.json \
    && chown $UID:0 /usr/share/nginx/html/servers.json

# Switch to non-privileged UID as the last step
USER $UID
