FROM mcr.microsoft.com/playwright:v1.51.1-noble

ENV NODE_VERSION 22.14

# Install Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash && \
    \. "$HOME/.nvm/nvm.sh" && \
    nvm install ${NODE_VERSION}
