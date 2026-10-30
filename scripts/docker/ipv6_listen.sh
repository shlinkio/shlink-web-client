#!/bin/sh

set -e

ME=$(basename "$0")
CONF_FILE="/etc/nginx/conf.d/default.conf"

entrypoint_log() {
  if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
    echo "$@"
  fi
}

# nginx listens on IPv4 and IPv6. Without IPv6 in the kernel it can't start, so remove the IPv6 listener.
# The change stays until the container is recreated.
if [ -f /proc/net/if_inet6 ]; then
  exit 0
fi
if ! grep -q 'listen \[::\]:8080' "$CONF_FILE"; then
  exit 0
fi

# The file belongs to root, so replace it instead of editing it. Its directory is writable.
TMP_FILE="$(dirname "$CONF_FILE")/.default.conf.tmp"
if { sed '/listen \[::\]:8080/d' "$CONF_FILE" > "$TMP_FILE" && mv -f "$TMP_FILE" "$CONF_FILE"; } 2>/dev/null; then
  entrypoint_log "$ME: info: no IPv6, listening on IPv4 only"
else
  rm -f "$TMP_FILE" 2>/dev/null || true
  entrypoint_log "$ME: error: no IPv6, and $CONF_FILE can't be changed (read-only or permissions?). nginx will fail."
fi

exit 0
