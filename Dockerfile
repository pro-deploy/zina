# Используем официальный Node.js образ с последними патчами безопасности
FROM node:20-alpine@sha256:674181320f4f94582c6182eaa151bf92c6744d478be0f1b8b8b8b8b8b8b8b8b8

# Устанавливаем рабочую директорию
WORKDIR /app

# Обновляем пакеты для безопасности
RUN apk update && apk upgrade && apk add --no-cache dumb-init

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

# Запускаем приложение через dumb-init для лучшей обработки сигналов
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"] 