#!/bin/sh

set -e

ME=$(basename $0)

setup_single_shlink_server() {
  [ -n "$SHLINK_SERVER_URL" ] || return 0
  [ -n "$SHLINK_SERVER_API_KEY" ] || return 0
  local name="${SHLINK_SERVER_NAME:-Shlink}"
  echo "[{\"name\":\"${name}\",\"url\":\"${SHLINK_SERVER_URL}\",\"apiKey\":\"${SHLINK_SERVER_API_KEY}\"}]" > /usr/share/nginx/html/servers.json
}

setup_single_shlink_server

exit 0
