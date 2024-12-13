# Use the official Deno image
FROM denoland/deno:latest

# Set the working directory
WORKDIR /app

# Cache dependencies first
COPY deno.json* .

# Copy project files
COPY . .

# Install dependencies (if any)
RUN deno cache src/Main/start.ts

# Expose the application port (e.g., 8000)
EXPOSE 8101

# Run the Deno application
CMD ["deno", "run", "start"]