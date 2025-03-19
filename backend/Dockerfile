FROM node:22

RUN mkdir -p /app
WORKDIR /app
COPY tsconfig.json /app/tsconfig.json
COPY package.json /app/package.json

RUN npm install
COPY /src /app/src
RUN npm run build

# Define default command.
CMD ["npm", "start"]
