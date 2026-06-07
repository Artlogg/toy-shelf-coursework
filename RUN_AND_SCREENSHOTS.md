# Запуск, скриншоты и GitHub

## 1. Подготовка

На компьютере должен быть установлен Node.js LTS. При установке обязательно должен появиться `npm`.

Проверка:

```powershell
node -v
npm -v
git --version
```

Если `npm` не найден, установите Node.js LTS с сайта https://nodejs.org/ и перезапустите терминал.

## 2. Запуск сервера

Откройте терминал в папке проекта и выполните:

```powershell
cd Source\backend
npm.cmd install
npm.cmd run start:dev
```

Сервер должен запуститься на адресе:

```text
http://localhost:3000
```

Проверка API в браузере:

```text
http://localhost:3000/users
http://localhost:3000/toys
```

## 3. Запуск клиента

Откройте второй терминал:

```powershell
cd Source\frontend
npm.cmd install
npm.cmd run dev
```

Vite покажет адрес клиента, обычно:

```text
http://localhost:5173
```

Откройте этот адрес в браузере.

## 4. Демо-доступ

- Администратор: `admin / admin123`
- Клиент: `client / client123`
- Гость: выбрать роль `Гость`

## 5. Какие скриншоты вставить в отчет

В DOCX-отчете можно вставить изображения в разделы 5 и 6.

Рекомендуемые скриншоты:

1. Главный экран приложения с витриной игрушек.
2. Карточки товаров с картинками и фильтром категорий.
3. Вход под ролью клиента.
4. Добавление товара в корзину.
5. Корзина с количеством товаров и итоговой суммой.
6. Вход под ролью администратора и форма создания пользователя.
7. Успешное создание пользователя.
8. Ошибка при вводе некорректного email.
9. Ответ `GET /users` в браузере или Postman.
10. Ответ `GET /toys` в браузере или Postman.
11. Ответ `POST /users` в Postman/Thunder Client.
12. Логи запросов в терминале backend.

После вставки скриншотов в Word обновите оглавление и экспортируйте отчет в PDF.

## 6. Публикация на GitHub

Создайте на GitHub пустой публичный репозиторий:

```text
toy-shelf-coursework
```

Затем выполните в папке проекта:

```powershell
git init
git add .
git commit -m "Add Toy Shelf coursework"
git branch -M main
git remote add origin https://github.com/Artlogg/toy-shelf-coursework.git
git push -u origin main
```

Ссылка для отчета:

```text
https://github.com/Artlogg/toy-shelf-coursework
```
