# Курсовая работа

## Тема

Клиент-серверное приложение Toy Shelf для учета игрушек и пользователей системы.

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

## Демо-доступ

- Администратор: `admin / admin123`
- Клиент: `client / client123`
- Гость: выбрать роль `Гость`

## API

- `GET /users` — список пользователей
- `GET /users/:id` — пользователь по идентификатору
- `POST /users` — создание пользователя
- `POST /auth/login` — демонстрационная авторизация
- `GET /toys` — каталог игрушек

## Корзина

Корзина работает на стороне клиента и сохраняется в LocalStorage. Гость может просматривать товары, клиент и администратор могут добавлять товары в корзину и оформлять демонстрационный заказ.

## Проверка

Пример запроса создания пользователя:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/users -Method POST -ContentType 'application/json' -Body '{"name":"Test User","email":"test@example.com","age":20}'
```

Данные пользователей хранятся в памяти сервера и исчезают после перезапуска приложения.
