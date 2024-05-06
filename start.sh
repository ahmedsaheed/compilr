#!/usr/bin/env bash

CYAN='\033[0;36m'
# build necessary images 
echo -e "${CYAN}Building C compiler image"
cd ./compilers/c-env && docker build -t c-env . 

echo -e "${CYAN}Building Java compiler image"
cd ../java-env && docker build -t java-env .

echo -e "${CYAN}Building Python compiler image"
cd ../python-env && docker build -t python-env .

echo -e "${CYAN}Building server microservice image"
cd ../../coordinator && docker build -t server .

echo -e "${CYAN}Building client microservice image"
cd ../frontend && docker build -t client .


# initialize the swarm and deploy the stack
echo -e "${CYAN}Initializing the swarm and deploying the stack"
cd ../ && docker swarm init && docker stack deploy --compose-file docker-stack.yml online-compiler
echo -e "${CYAN} All services are up and running"
echo -e "${CYAN} You can access the frontend at http://localhost:3000"
