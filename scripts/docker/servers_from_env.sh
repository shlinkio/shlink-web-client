#!/bin/sh

set -e

ME=$(basename $0)

# In order to allow people to pre-configure a server in their shlink-web-client instance via env vars, this function
# dumps a servers.json file based on the values provided via env vars
setup_single_shlink_server() {
  [ -n "$SHLINK_SERVER_URL" ] || return 0
  [ -n "$SHLINK_SERVER_API_KEY" ] || return 0
  local name="${SHLINK_SERVER_NAME:-Shlink}"
  local forwardCredentials="${SHLINK_SERVER_FORWARD_CREDENTIALS:-false}"
  echo "[{\"name\":\"${name}\",\"url\":\"${SHLINK_SERVER_URL}\",\"apiKey\":\"${SHLINK_SERVER_API_KEY}\",\"forwardCredentials\":${forwardCredentials}}]" > /usr/share/nginx/html/servers.json
}

setup_single_shlink_server

exit 0
