# Use the official Node.js image as the base image
FROM docker:latest

# Install the latest version of Node.js
RUN apk add --update nodejs npm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the server will run
ENV PORT 8080
EXPOSE 8080


# Start the server
CMD ["npm", "run", "build-exec"]
