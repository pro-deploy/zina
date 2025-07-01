# Используем Node.js 21-alpine для лучшей безопасности
FROM node:21-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Обновляем пакеты для безопасности
RUN apk update && apk upgrade

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production && npm cache clean --force

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

# Открываем порт 8080 для домена
EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Запускаем приложение
CMD ["npm", "start"] 