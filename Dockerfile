FROM node:22-alpine
WORKDIR /app

# Передаем переменные окружения для сборки
ARG VITE_HOST_NAME
ENV VITE_HOST_NAME=$VITE_HOST_NAME

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3333

CMD [ "npm", "run", "preview" ]