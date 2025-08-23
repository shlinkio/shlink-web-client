FROM mcr.microsoft.com/playwright:v1.55.0-noble

ENV NODE_VERSION 22.14
ENV TINI_VERSION v0.19.0

# Install Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash && \
    \. "$HOME/.nvm/nvm.sh" && \
    nvm install ${NODE_VERSION}

# Install tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /sbin/tini
RUN chmod +x /sbin/tini
# Set tini as the entry point, as node does not properly handle signals
ENTRYPOINT ["/sbin/tini", "--"]
