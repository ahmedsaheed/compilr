# Use the official OpenJDK image as the base image
FROM openjdk:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the Java source code to the container
COPY . /app

# Compile the Java code
RUN javac Main.java

# Set the default command to run the compiled Java program
CMD ["java", "Main"]