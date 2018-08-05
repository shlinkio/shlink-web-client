FROM node:10.4.1-alpine
MAINTAINER Alejandro Celaya <alejandro@alejandrocelaya.com>

# Install yarn
RUN apk add --no-cache --virtual yarn

# Make home dir writable by anyone
RUN chmod 777 /home

CMD cd /home/shlink/www && \
    yarn install && \
    yarn start
