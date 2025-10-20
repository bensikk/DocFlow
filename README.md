# DocFlow — запуск и настройка

Коротко: проект состоит из двух основных частей — `backend/` (Node.js, TypeScript, Prisma, PostgreSQL) и `frontend/` (Vite + React + Electron). Ниже — подробная инструкция по настройке и запуску на Windows (PowerShell). Команды адаптированы для случая, когда у вас есть PostgreSQL с ролью `docflow_user` и паролем `admin`, БД `docflow`.

## Структура репозитория
- `backend/` — серверная часть
- `frontend/` — клиентская часть (Vite + Electron)
- `docker-compose.yml` — образ для поднятия Postgres (опция)

---

## Переменные окружения
В `backend/` есть шаблон `.env.example`. Создайте файл `.env` в `backend/` и заполните:

Пример `backend/.env` (для локального Postgres на `localhost`):

DATABASE_URL="postgresql://docflow_user:admin@localhost:5432/docflow?schema=public"
JWT_SECRET="change_this_secret"
ADMIN_PASSWORD="Admin123!"

Замените `JWT_SECRET` на произвольную сильную строку, если нужно.

---

## Вариант A — использовать Docker (рекомендовано если нет локального Postgres)
1. Убедитесь, что Docker Desktop запущен.
2. В корне репозитория выполните:

```powershell
cd "C:\Users\Sasha\OneDrive - Kharkiv National University of Radioelectronics\Рабочий стол\DocFlow\DocFlow"
docker-compose up -d
```

3. Подключиться к БД через pgAdmin: host `localhost`, port `5432`, user `docflow`, password `docflowpass`, database `docflow_db`.

> Примечание: если используете Docker, отредактируйте `backend/.env` на соответствующую строку подключения (пример для Docker):
> DATABASE_URL="postgresql://docflow:docflowpass@localhost:5432/docflow_db?schema=public"

---

## Вариант B — использовать существующий Postgres / pgAdmin (ваш случай)
Если у вас уже есть роль `docflow_user` и БД `docflow` (пароль `admin`), просто создайте `.env` как в примере выше и продолжайте.

Если роли/БД нет, выполните в pgAdmin (Query Tool) под суперпользователем:

```sql
CREATE ROLE docflow_user WITH LOGIN PASSWORD 'admin';
CREATE DATABASE docflow OWNER docflow_user;
GRANT ALL PRIVILEGES ON DATABASE docflow TO docflow_user;
```

Если БД уже есть, но роль не имеет прав на схему/таблицы:

```sql
GRANT USAGE ON SCHEMA public TO docflow_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO docflow_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO docflow_user;
```

---

## Запуск backend (PowerShell)
Перейдите в папку `backend` и выполните команды по порядку:

```powershell
cd "C:\Users\Sasha\OneDrive - Kharkiv National University of Radioelectronics\Рабочий стол\DocFlow\DocFlow\backend"

# Установить зависимости
npm install

# Сгенерировать Prisma client
npm run prisma:generate

# Применить миграции
npm run prisma:migrate

# Залить seed
npm run seed

# Запустить dev-сервер
npm run dev
```

Проверить health:
```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:3000/health
```

---

## Запуск frontend (PowerShell)
```powershell
cd "C:\Users\Sasha\OneDrive - Kharkiv National University of Radioelectronics\Рабочий стол\DocFlow\DocFlow\frontend"
npm install
npm run dev
```

Если вы не хотите запускать Electron, можно запустить только Vite командой `npx vite`.

---

## Полезные команды и отладка
- Проверить доступность порта Postgres:
```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

- Логи Docker (если используете docker-compose):
```powershell
cd "C:\Users\Sasha\OneDrive - Kharkiv National University of Radioelectronics\Рабочий стол\DocFlow\DocFlow"
docker-compose logs -f
```

- Если Prisma жалуется на ошибку в строке подключения — проверьте `backend/.env` на лишние символы (внимание: в .env.example в репозитории был лишний префикс `wsl w` — удалите его).

- Если возникают проблемы с OneDrive и путями, клонируйте проект в простой путь `C:\projects\DocFlow` и повторите команды.

---

## Что делать если что-то пойдёт не так
1. Запустите команды и сохраните вывод ошибок (особенно `npm run prisma:migrate` и `npm run dev`).
2. Пришлите сюда вывод — разберёмся (чаще всего это: ошибка подключения, права пользователя, конфликт портов, или проблема с путями).

---

Удачи! Если хотите, могу добавить PowerShell-скрипт `backend/setup-and-run.ps1`, который автоматизирует эти шаги (создаст `.env`, установит зависимости, выполнит миграции и запустит dev). Скажите, нужно ли автоматически запускать Docker в нём или только локальные шаги?