FROM node:12.14.1-alpine as node
COPY . /shlink-web-client
ARG VERSION="latest"
ENV VERSION ${VERSION}
RUN cd /shlink-web-client && \
    UNCOMPRESSED="shlink-web-client_${VERSION}_dist" && \
    DIST_FILE="./dist/${UNCOMPRESSED}.zip" && \
    # If a dist file already exists, just unzip it
    if [[ -f ${DIST_FILE} ]]; then unzip ${DIST_FILE} && mv ./${UNCOMPRESSED} ./build ; fi && \
    # If no dist file exsts, build from scratch
    if [[ ! -f ${DIST_FILE} ]]; then npm install && npm run build -- ${VERSION} --no-dist ; fi

FROM nginx:1.17.7-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY config/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /shlink-web-client/build /usr/share/nginx/html
