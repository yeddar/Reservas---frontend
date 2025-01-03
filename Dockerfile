# Construir los archivos optimizados
FROM node:18 as builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Servir los archivos estáticos usando Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

