# Use the official Node.js LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first for caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy remaining source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port your app listens on (default Express.js port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
