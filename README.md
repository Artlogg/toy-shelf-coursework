# Курсовая работа

## Тема

Клиент-серверное приложение Toy Shelf для учета игрушек и пользователей системы.

## Что внутри

- `Source/backend` — серверная часть на NestJS.
- `Source/frontend` — клиентская часть на React + Vite.
- `Documents` — пояснительная записка в форматах DOCX и PDF.

## Как запустить

1. Установить Node.js LTS.
2. Открыть терминал в папке `Source/backend`.
3. Выполнить:

```powershell
npm install
npm run start:dev
```

4. Открыть второй терминал в папке `Source/frontend`.
5. Выполнить:

```powershell
npm install
npm run dev
```

6. Сервер работает на `http://localhost:3000`, клиент — на адресе, который покажет Vite.

## Демо-доступ

- Администратор: `admin / admin123`
- Клиент: `client / client123`
- Гость: выбрать роль `Гость`

## API

- `GET /users` — список пользователей
- `GET /users/:id` — пользователь по идентификатору
- `POST /users` — создание пользователя
- `POST /auth/login` — демонстрационная авторизация
- `GET /toys` — демонстрационный список игрушек

## Проверка

Пример запроса создания пользователя:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/users -Method POST -ContentType 'application/json' -Body '{"name":"Test User","email":"test@example.com","age":20}'
```

Данные пользователей хранятся в памяти сервера и исчезают после перезапуска приложения.
