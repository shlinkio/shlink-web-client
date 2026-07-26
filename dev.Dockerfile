FROM mcr.microsoft.com/playwright:v1.61.1-noble

ENV TINI_VERSION v0.19.0

# Install tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /sbin/tini
RUN chmod +x /sbin/tini
# Set tini as the entry point, as node does not properly handle signals
ENTRYPOINT ["/sbin/tini", "--"]
