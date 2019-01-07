FROM nginx:1.15.8-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"

# Install node and yarn
RUN apk add --no-cache nodejs && apk add --no-cache yarn

ADD . ./shlink-web-client

# Install dependencies and build project
RUN cd ./shlink-web-client && \
    yarn install && \
    yarn build && \

    # Move build contents to document root
    cd .. && \
    rm -r /usr/share/nginx/html/* && \
    mv ./shlink-web-client/build/* /usr/share/nginx/html && \
    rm -r ./shlink-web-client && \

    # Delete and uninstall build tools
    yarn cache clean && apk del yarn && apk del nodejs
