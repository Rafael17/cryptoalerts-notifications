FROM node:12-slim
WORKDIR /usr/src/app

COPY package.json . 
COPY src src
COPY .env .

RUN npm install
EXPOSE 3015
CMD npm run dev
