
FROM node:20-alpine AS builder

WORKDIR /app


COPY package*.json ./
COPY tsconfig.json ./


RUN npm install


COPY . .


ENV NODE_ENV=development



RUN npm run build



FROM node:20-alpine AS runner

WORKDIR /app


COPY package*.json ./


RUN npm install 


COPY --from=builder /app/dist ./dist


EXPOSE 8000


CMD ["node", "dist/server.js"]
