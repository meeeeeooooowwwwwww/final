FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and generate package-lock.json
RUN npm ci

# Copy the rest of the application
COPY . .

# The container will exit after this command
CMD ["npm", "ci"] 