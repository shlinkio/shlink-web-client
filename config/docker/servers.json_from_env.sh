#!/bin/sh

set -e

ME=$(basename $0)

setup_single_shlink_server() {
  [ -n "$SHLINK_CLIENT_SERVER_URL" ] || return 0
  [ -n "$SHLINK_CLIENT_API_KEY" ] || return 0
  local name="${SHLINK_CLIENT_SERVER_NAME:-Shlink}"
  echo "[{\"name\":\"${name}\",\"url\":\"${SHLINK_CLIENT_SERVER_URL}\",\"apiKey\":\"${SHLINK_CLIENT_API_KEY}\"}]" > /usr/share/nginx/html/servers.json
}

setup_single_shlink_server

exit 0
