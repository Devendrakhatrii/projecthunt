# Use official Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files separately to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Start Next.js in dev mode
CMD ["npm", "run", "dev"]
