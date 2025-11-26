FROM node:18-alpine

# Install Chromium and dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    libx11 \
    libxcomposite \
    libxdamage \
    libxext \
    libxfixes \
    libxrandr \
    libxrender \
    libxtst \
    cups \
    dbus \
    gconf-service \
    gtk+3.0 \
    libasound2 \
    libatk1.0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0 \
    libxss1 \
    fonts-liberation \
    lsb-release \
    xdg-utils

# Create a symlink for chromium
RUN ln -sf /usr/bin/chromium-browser /usr/bin/google-chrome || \
    ln -sf /usr/bin/chromium /usr/bin/google-chrome || \
    echo "Chromium binary not found at expected locations"

# Verify chromium installation
RUN echo "Chromium version:" && chromium --version || echo "Chromium not found"

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Clean and build the application
RUN rm -rf dist && \
    echo "Building TypeScript..." && \
    npx tsc && \
    echo "TypeScript build complete" && \
    echo "Copying public files..." && \
    node copy-public.mjs && \
    echo "Build complete" && \
    ls -la dist/v2/

# Create data directory
RUN mkdir -p /app/data

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Expose port
EXPOSE 7889

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:7889', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["pnpm", "run", "start:v2"]