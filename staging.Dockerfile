FROM node:18.14.2 AS builder

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

ARG REACT_APP_API_URL

ARG REACT_APP_CLIENT_ID

ARG REACT_APP_CLIENT_SECRET

ARG REACT_APP_WS_URL

ARG REACT_APP_LOGO_URL

ARG REACT_APP_ENVIRONMENT

RUN yarn build

FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build/ /usr/share/nginx/html/
