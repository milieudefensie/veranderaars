FROM node:18.13.0-alpine

RUN apk add --update python3 make g++\
  && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/

RUN yarn --pure-lockfile

COPY . /usr/src/app

ENV ENABLE_GATSBY_REFRESH_ENDPOINT true
ENV GATSBY_TELEMETRY_DISABLED true
ENV DATO_PREVIEW true

EXPOSE 80

CMD ["yarn", "preview", "-p", "80"]