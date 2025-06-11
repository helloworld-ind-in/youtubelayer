FROM node:18-alpine

RUN apk update
RUN apk upgrade

WORKDIR /app

COPY index.js .
COPY .env .
COPY package.json .

RUN npm install

CMD ["npm", "start"]