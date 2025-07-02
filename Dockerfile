# Используем Node.js 21-alpine для лучшей безопасности
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Обновляем пакеты для безопасности
RUN apk update && apk upgrade

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev-зависимости для сборки)
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Открываем порт 80 для домена
EXPOSE 80

ENV NODE_ENV=production

# Запускаем приложение
CMD ["npm", "start"] 