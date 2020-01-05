FROM node:alpine

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apk add --update \
  && apk add git \
  && npm install --production

ENV PORT 80
EXPOSE 80

COPY . .
CMD ["npm", "start"]
