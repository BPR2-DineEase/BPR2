# Step 1: Build the React app
FROM node:18 AS build

# Set working directory inside container
WORKDIR /app

COPY package.json package-lock.json ./


# Copy all files and build the project
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

# Copy the custom NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app to the NGINX html directory
COPY --from=build /app/dist /usr/share/nginx/html


# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
