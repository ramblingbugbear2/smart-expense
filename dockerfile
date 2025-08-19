# ---- Base image ----
FROM node:20-alpine

# ---- App dir ----
WORKDIR /usr/src/app

# ---- Install deps ----
# copy only package files first for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Copy source ----
COPY . .

# ---- Runtime env ----
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# ---- Start server ----
# your package.json runs "node api/app.js"
CMD ["npm","start"]
