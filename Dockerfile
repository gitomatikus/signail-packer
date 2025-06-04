# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Development stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Expose port 3000 for development
EXPOSE 3000

# Start the development server with hot reloading
CMD ["npm", "start"]

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

# Install serve globally
RUN npm install -g serve

# Expose port 3005 
EXPOSE 3005

# Start the application
CMD ["serve", "-s", "build", "-l", "3005"] 