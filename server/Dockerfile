# Stage 1: Build the TypeScript application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server application files
COPY server/ ./

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY server/package*.json ./

EXPOSE 5000

CMD ["node", "dist/index.js"]
