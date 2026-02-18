FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY vite.config.js ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY index.html ./

# Build
RUN npm run build

# Serve with a simple HTTP server
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=0 /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
