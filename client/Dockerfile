# Build stage
FROM node:20-alpine AS builder

WORKDIR /app


COPY package*.json  package-lock.json ./
COPY tsconfig.json ./


RUN npm install


COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install


COPY . .


EXPOSE 5173



CMD ["npm", "run", "dev", "--", "--host"]