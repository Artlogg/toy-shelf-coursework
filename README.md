# Курсовая работа

## Тема

Клиент-серверное приложение магазина игрушек `artlo`.

## Что внутри

- `Source/backend` — серверная часть на NestJS.
- `Source/frontend` — клиентская часть на React + Vite.
- `Documents` — пояснительная записка в форматах DOCX и PDF.
- `RUN_AND_SCREENSHOTS.md` — запуск, скриншоты и GitHub.


## API

- `GET /users` — список пользователей
- `GET /users/:id` — пользователь по идентификатору
- `POST /users` — создание пользователя
- `DELETE /users/:id` — удаление пользователя
- `POST /auth/login` — демонстрационная авторизация
- `GET /toys` — каталог игрушек
- `POST /toys/checkout` — оформление заказа и уменьшение остатков

## Корзина

Корзина работает на стороне клиента и сохраняется в LocalStorage. При оформлении заказа frontend отправляет товары на сервер, сервер уменьшает остатки в памяти и возвращает обновленный каталог.

## Проверка

Пример запроса создания пользователя:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/users -Method POST -ContentType 'application/json' -Body '{"name":"Test User","email":"test@example.com","age":20}'
```

Данные пользователей хранятся в памяти сервера и исчезают после перезапуска приложения.
