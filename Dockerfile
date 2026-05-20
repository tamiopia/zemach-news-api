FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and Prisma schema
COPY . .

# Generate Prisma client and build TypeScript code
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Run migration, seed, and then start the server
CMD ["npm", "run", "docker:start"]
