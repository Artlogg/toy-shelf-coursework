# Backend

Серверная часть приложения Toy Shelf построена на NestJS.

## Запуск

```powershell
npm install
npm run start:dev
```

## Основные возможности

- REST API для пользователей.
- DTO и `class-validator` для проверки входных данных.
- Контроллеры и сервисы NestJS.
- Провайдеры через dependency injection.
- Декораторы `@Controller`, `@Get`, `@Post`, `@Body`, `@Param`, `@Injectable`.
- Единый фильтр HTTP-ошибок.
- Логирование запросов.
- Демонстрационная авторизация с bcrypt-хешами паролей.
- In-memory хранение пользователей.

