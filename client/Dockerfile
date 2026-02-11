# STAGE 1: Build the application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY ./client/package*.json ./

# Install dependencies and build the application
RUN npm install
COPY ./client/ ./
RUN npm run build

# STAGE 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files for production
COPY ./client/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application from the 'build' stage
COPY --from=build /app/dist ./dist

# Expose the port the app will run on
EXPOSE 80

# The command to start the production server
CMD ["npm", "start"]
