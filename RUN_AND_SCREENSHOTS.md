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

## 4. Регистрация

При первом открытии сайта появится стартовая страница. Можно зарегистрировать покупателя или войти как администратор.

Администратор:

```text
admin / admin123
```

## 5. Какие скриншоты вставить в отчет

В DOCX-отчете можно вставить изображения в разделы 5 и 6.

Рекомендуемые скриншоты:

1. Главный экран приложения с витриной игрушек.
2. Карточки товаров с картинками и фильтром категорий.
3. Начальная страница с регистрацией и входом администратора.
4. Успешная регистрация пользователя или вход администратора.
5. Добавление товара в корзину.
6. Корзина с количеством товаров и итоговой суммой.
7. Оформление заказа и уменьшение остатка товара.
8. Ошибка при вводе некорректного email.
9. Ответ `GET /users` в браузере или Postman.
10. Ответ `GET /toys` в браузере или Postman.
11. Ответ `POST /users` в Postman/Thunder Client.
12. Ответ `POST /toys/checkout` в Postman/Thunder Client.
13. Логи запросов в терминале backend.

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
