############################################################
# BUILD
############################################################

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY angular.json .
COPY package*.json .
COPY tsconfig*.json .
COPY src ./src
COPY public ./public

RUN npm run build

############################################################
# RUNTIME
############################################################

FROM nginx:1.27-alpine

LABEL maintainer="Numecos"

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/ecommerce-front/browser/ /usr/share/nginx/html/

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]