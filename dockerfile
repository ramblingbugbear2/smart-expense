FROM node:20-alpine

WORKDIR /usr/src/app

# Copy and build frontend first
COPY client/ ./client/
RUN cd client && npm ci && npm run build

# Copy backend
COPY api/ ./api/
RUN cd api && npm ci --omit=dev

# Copy root package.json
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
