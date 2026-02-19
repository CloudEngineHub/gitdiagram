FROM node:22.12.0-slim AS node-runtime
FROM python:3.12-slim

WORKDIR /app
ENV ENVIRONMENT=production
ENV PORT=8000

COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node
COPY --from=node-runtime /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# Install uv inside the image
COPY --from=ghcr.io/astral-sh/uv:0.5.24 /uv /uvx /bin/

# Copy dependency manifests first for better layer caching
COPY pyproject.toml uv.lock ./
COPY package.json ./
COPY package-lock.json ./

# Install pinned runtime dependencies from uv lockfile
RUN uv sync --frozen --no-dev --no-install-project
RUN npm ci --omit=dev

# Copy application code
COPY . .
RUN chmod +x /app/entrypoint.sh && \
    sed -i 's/\r$//' /app/entrypoint.sh && \
    ls -la /app/entrypoint.sh

EXPOSE 8000

CMD ["/bin/bash", "/app/entrypoint.sh"]
