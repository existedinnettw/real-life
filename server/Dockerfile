FROM node:14

# Create the working directory that holds the application code inside our image.
RUN mkdir /app
WORKDIR /app

# Install app dependencies inside our image. copy package.json to app folder in docker image
COPY package.json /app
RUN npm install

# Bundle app source
COPY . /app

# Bind app to the specified port to be mapped by the Docker daemon.
EXPOSE 4000

# Define the command to run app.
# for local develop 
#CMD ["npm", "run", "start:localDocker"]

# for aws
CMD ["npm", "run", "start:aws"]