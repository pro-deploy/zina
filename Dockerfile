# Используем официальный Node.js образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

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

# Открываем порт 80 для домена
EXPOSE 8080

ENV NODE_ENV=production

# Запускаем приложение
CMD ["npm", "start"] 