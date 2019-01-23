FROM node:alpine

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN apk add --update \
  && yarn install --production

ENV PORT 80
EXPOSE 80

COPY . .
CMD ["yarn", "start"]
