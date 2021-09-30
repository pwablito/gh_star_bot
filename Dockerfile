FROM node:latest


COPY package-lock.json /app/.

RUN npm install

COPY * /app/.

WORKDIR /app

CMD node starbot.js
