FROM node:24.2-alpine AS node
COPY . /shlink-web-client
ARG VERSION="latest"
ENV VERSION=${VERSION}

WORKDIR /shlink-web-client

ARG BASE_PATH
RUN npm ci
RUN if [[ -n $BASE_PATH ]]; then node ./scripts/set-homepage.cjs $BASE_PATH ; fi
RUN cat ./scripts/set-homepage.cjs
RUN node --run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
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
