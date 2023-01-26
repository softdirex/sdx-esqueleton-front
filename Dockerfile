### STAGE 1: Prepare folder`s release ###
FROM node:16.18-alpine AS build
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN ls /app
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html