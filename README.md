# Курсовая работа

## Тема

Клиент-серверное приложение магазина игрушек `artlo`.

## Что внутри

- `Source/backend` — серверная часть на NestJS.
- `Source/frontend` — клиентская часть на React + Vite.
- `Documents` — пояснительная записка в форматах DOCX и PDF.
- `RUN_AND_SCREENSHOTS.md` — запуск, скриншоты и GitHub.

## Как запустить на Windows

1. Установить Node.js LTS.
2. Открыть PowerShell в папке проекта.
3. Если PowerShell ругается на `npm.ps1`, используйте `npm.cmd`.
4. Если появляется `Access is denied` для `node`, сначала выполните:

```powershell
$env:Path="C:\Program Files\nodejs;$env:Path"
```

5. Запустить сервер:

```powershell
cd Source\backend
npm.cmd install
npm.cmd run start:dev
```

6. Открыть второй PowerShell и запустить клиент:

```powershell
cd Source\frontend
npm.cmd install
npm.cmd run dev
```

7. Сервер работает на `http://localhost:3000`, клиент — на адресе, который покажет Vite.

## Работа с сайтом

Сначала открывается стартовая страница. На ней есть два режима:

- регистрация покупателя: пользователь вводит имя, email и возраст, профиль создается через `POST /users`, сайт переходит в магазин;
- вход администратора: логин `admin`, пароль `admin123`.

## API

- `GET /users` — список пользователей
- `GET /users/:id` — пользователь по идентификатору
- `POST /users` — создание пользователя
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
