FROM node:20.11.0 AS builder

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

ARG REACT_APP_API_URL

ARG REACT_APP_CF_ACCESS_CLIENT_ID

ARG REACT_APP_CF_ACCESS_CLIENT_SECRET

ARG REACT_APP_WS_URL

ARG REACT_APP_LOGO_URL

ARG REACT_APP_ENVIRONMENT

ARG REACT_APP_LOCKER_SECRETS_URL

RUN yarn build

FROM nginx:stable-alpine3.23

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build/ /usr/share/nginx/html/
