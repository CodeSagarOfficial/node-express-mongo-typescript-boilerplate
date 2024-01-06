# Use an official Node.js runtime as a parent image
FROM node:18.17.1-alpine AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY tsconfig.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Compile TypeScript code
RUN npm run build

# Use a smaller base image for the final stage
FROM node:18.17.1-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
COPY .env ./

# Install only production dependencies
RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Expose the port on which your app will run
EXPOSE 3000

# Use PM2 as the process manager
CMD ["pm2-runtime", "dist/index.js"]
