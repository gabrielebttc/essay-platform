FROM node:18-alpine AS build

WORKDIR /app

ARG VITE_BACKEND_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

COPY ./client/package*.json ./
RUN npm install
COPY ./client/ ./
RUN VITE_BACKEND_URL=$VITE_BACKEND_URL VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY npm run build

FROM nginx:stable-alpine
COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
