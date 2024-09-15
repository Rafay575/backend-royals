# Use the official Node.js image as the base image
FROM node:20-slim

# Set environment variables
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before copying the rest of the code
# This helps in leveraging Docker’s layer caching
COPY package*.json ./

# Install only production dependencies (no development dependencies)
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Specify the port number the app runs on
EXPOSE 5000

# Define the command to run the app
CMD [ "node", "index.js" ]
