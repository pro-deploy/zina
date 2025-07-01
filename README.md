# Зина GPT - ИИ-ассистент

Современное веб-приложение с ИИ-ассистентом в теплых тонах, созданное на Next.js.

## 🚀 Особенности

- 🤖 Интеграция с OpenAI GPT-3.5-turbo
- 🎨 Современный дизайн в теплых оранжево-красных тонах
- 💬 Чат-интерфейс с реальным временем
- 📱 Адаптивный дизайн
- ⚡ Быстрая работа на Next.js 15

## 🛠️ Установка и запуск

1. **Клонируйте репозиторий**
   ```bash
   git clone <your-repo-url>
   cd zina-gpt
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения**
   
   Создайте файл `.env.local` в корне проекта:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Получите API ключ на [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Запустите приложение**
   ```bash
   npm run dev
   ```

5. **Откройте браузер**
   
   Перейдите по адресу [http://localhost:3000](http://localhost:3000)

## 🎨 Дизайн

Приложение использует:
- **Цветовая схема**: Теплые оранжево-красные тона
- **Шрифты**: Geist Sans и Geist Mono
- **Иконки**: Lucide React
- **Стилизация**: Tailwind CSS

## 🔧 Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Стили**: Tailwind CSS 4
- **ИИ**: OpenAI GPT-3.5-turbo
- **Иконки**: Lucide React

## 📝 Использование

1. Откройте приложение в браузере
2. Начните общение с Зиной, написав сообщение
3. Получайте умные и полезные ответы от ИИ-ассистента

## 🔒 Безопасность

- API ключи хранятся в переменных окружения
- Все запросы к ИИ проходят через серверную часть
- Нет прямого доступа к API ключам на клиенте

## 📄 Лицензия

MIT License

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Запуск в Docker

1. Соберите образ:
   ```bash
   docker build -t zina-gpt .
   ```
2. Запустите контейнер:
   ```bash
   docker run -p 3000:3000 --env-file .env zina-gpt
   ```

Приложение будет доступно на http://localhost:3000
