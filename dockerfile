FROM node:lts-alpine

# create a working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install all dependecies
RUN yarn install 

# copy everything 
COPY . .

# start the application
CMD ["yarn", "run", "dev" ]