FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD yarn prod
