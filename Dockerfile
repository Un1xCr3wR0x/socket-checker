FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 2000

# Install Redis server
RUN apt-get update && \
    apt-get install -y redis-server && \
    rm -rf /var/lib/apt/lists/*

# Configure Redis to listen on port 6377 without a password
RUN sed -i 's/^bind .*$/bind 0.0.0.0/' /etc/redis/redis.conf && \
    sed -i 's/^protected-mode yes$/protected-mode no/' /etc/redis/redis.conf && \
    sed -i 's/^port 6379$/port 6377/' /etc/redis/redis.conf && \
    sed -i '/^requirepass/ s/^/#/' /etc/redis/redis.conf

# Start Redis server and then the Node.js application
CMD ["bash", "-c", "redis-server --daemonize yes && npm start"]
