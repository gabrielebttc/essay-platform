# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client application files
COPY client/ ./

# Overwrite the .env file with the one for docker
COPY client/.env.docker ./.env

# Build the application for production
RUN npm run build

# Expose port 80
EXPOSE 80

