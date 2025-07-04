# Используем Node.js 21-alpine для лучшей безопасности
FROM node:21-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Обновляем пакеты для безопасности и устанавливаем nginx
RUN apk update && apk upgrade && apk add nginx

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev-зависимости для сборки)
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем скрипт запуска
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Собираем приложение
RUN npm run build

# Открываем порт 80 для nginx и порт 3000 для Next.js
EXPOSE 80 3000

ENV NODE_ENV=production

# Запускаем nginx и приложение
CMD ["/app/start.sh"] 