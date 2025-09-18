FROM node:20-alpine AS base
WORKDIR /app

# Copy package files first to take advantage of Docker layer caching
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3005
CMD ["node", "src/index.js"]