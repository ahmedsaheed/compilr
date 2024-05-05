# Use a base image with the desired operating system and version
FROM ubuntu:latest

# Install the necessary packages for C compilation
RUN apt-get update && apt-get install -y build-essential

# Set the working directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY . /app

# Compile the C code
RUN gcc -o myprogram myprogram.c

# Set the entry point for the container
CMD ["./myprogram"]