FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json  ./
COPY tsconfig.json ./


RUN npm install


COPY . .


ENV NODE_ENV=developnent

RUN npm run build 


FROM node:20-alpine

WORKDIR /app


COPY package*.json ./


RUN npm install --only=production


COPY --from=builder /app/dist ./dist


EXPOSE 8000

# Start server
CMD ["npm", "start"]