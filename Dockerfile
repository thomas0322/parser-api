FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build only the Express.js server (not serverless)
RUN npm run build:server

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"] 