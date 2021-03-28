# Build Container
FROM node:12 as build

WORKDIR /dash-client

COPY package.json /dash-client/package.json

RUN npm install

RUN npm install react-scripts -g

COPY . /dash-client

RUN npm run build

# Run Container
FROM nginx:1.16.0

COPY --from=build /dash-client/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]