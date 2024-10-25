FROM node:18.14.2 AS builder

WORKDIR /app

RUN (apt-get update && \
    apt-get install -y curl && \
    curl https://static.snyk.io/cli/latest/snyk-linux -o /tmp/snyk && \
    chmod +x /tmp/snyk && \
    mv /tmp/snyk /usr/local/bin/) || true

COPY package.json .

RUN yarn install

COPY . .

ARG REACT_APP_API_URL

ARG REACT_APP_CLIENT_ID

ARG REACT_APP_CLIENT_SECRET

ARG REACT_APP_WS_URL

ARG REACT_APP_LOGO_URL

ARG REACT_APP_ENVIRONMENT

ARG REACT_APP_LOCKER_SECRETS_URL

ARG SNYK_TOKEN

RUN snyk monitor --remote-repo-url={CI_PROJECT_ROOT_NAMESPACE} --project-name={CI_PROJECT_NAME} || true

RUN yarn build

FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build/ /usr/share/nginx/html/
