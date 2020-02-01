
FROM node:10.18.0-alpine3.9 as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Stage 2
FROM nginx:1.13.12-alpine

COPY --from=node /usr/src/app/dist/amat-backend-app /usr/share/nginx/html

COPY ./src/default.conf /etc/nginx/conf.d

