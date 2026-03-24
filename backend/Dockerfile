FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
# This optimizes the build process by utilizing Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the backend files
COPY . .

# Expose the port the app runs on (update if your backend uses a different port, e.g., 5000)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
