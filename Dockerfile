FROM node:22-alpine

WORKDIR /app

# Instala dependencias del sistema necesarias para desarrollo (opcional)
RUN apk add --no-cache bash

# Copia package.json y package-lock.json/yarn.lock
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto por defecto de NestJS
EXPOSE 3000

# Comando para desarrollo con hot reload
CMD ["npm", "run", "start:dev"]

