FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* bun.lock* ./
RUN npm install

COPY . .

ENV VITE_API_URL=http://localhost:8000
ENV PORT=3000

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* bun.lock* ./
RUN npm install --omit=dev

COPY --from=builder /app/.output /app/.output

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
