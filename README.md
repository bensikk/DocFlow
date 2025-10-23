# DocFlow — Система управління судовою технікою та документами

> Простий прототип десктопної системи для суду: облік техніки, робота з документами, ролі (Адміністратор / Користувач), аудиту дій та завантаження сканів.

---

## Коротко

- Стек: Electron + React (TypeScript) — фронтенд (Vite) та десктоп-обгортка; Node.js + Express (TypeScript) — бекенд; Prisma ORM + PostgreSQL — зберігання даних.
- Мета: мати простий інструмент для обліку принтерів/сканерів, завантаження та обробки документів, та просту систему ролей.

---

## Структура репозиторію

- `backend/` — серверна частина (Express, Prisma)
	- `src/` — код сервера
	- `prisma/` — схема та міграції
	- `package.json` — скрипти для запуску, seed, міграцій
- `frontend/` — React + Electron клієнт
	- `src/` — компоненти React, сторінки, стилі
	- `package.json` — скрипти dev/build/electron
- `README.md` — цей файл

---

## Швидкий запуск (Windows PowerShell)

Перед запуском переконайтесь, що встановлені:
- Node.js (рекомендовано 18+)
- npm
- PostgreSQL (або змініть DATABASE_URL у `.env` під ваш сервер)

1) Клонуйте репозиторій:

```powershell
git clone https://github.com/bensikk/DocFlow.git
cd DocFlow
```

2) Установіть залежності

```powershell
cd backend
npm install
cd ..\frontend
npm install
```

3) Налаштуйте базу даних

- Скопіюйте `.env.example` в `backend/.env` і змініть `DATABASE_URL` згідно вашої PostgreSQL інсталяції. Приклад:

```
DATABASE_URL="postgresql://user:password@localhost:5432/docflow"
JWT_SECRET=your_secret_here
```

4) Міграція та seed

```powershell
cd backend
npx prisma migrate dev --name init
npm run seed
```

Seed створює адміністратора із тимчасовими даними (за замовчуванням):

- Email: `admin@court.local`
- Password: `Admin123!`

5) Запустіть сервер та фронтенд в режимі розробки

```powershell
# В одному терміналі — сервер
cd backend
npm run dev

# В іншому терміналі — фронтенд (vite + electron dev)
cd frontend
npm run dev
```

Потім відкрийте: `http://localhost:5173` для веб-версії або використайте Electron обгортку (як налаштовано у `frontend/package.json`).

---

## Основні маршрути API

- POST `/auth/login` — логін (body: `{ email, password }`) → повертає JWT
- POST `/auth/register` — реєстрація (відкрита, створює роль USER)
- GET `/auth/me` — інформація про поточного користувача (потрібен Authorization: Bearer)
- CRUD `/devices` — техніка (статус, інвентарний номер тощо)
- CRUD `/documents` — документи (номер справи, тип, сторінки, автогенерація назви)

Більш детально дивіться код у `backend/src/index.ts`.

---

## Коментарі щодо Git і великих файлів

- В репозиторій НЕ повинні потрапляти `node_modules/` та великі двійкові файли (наприклад `electron.exe`). Якщо у вас є великі артефакти — зберігайте їх як Release assets на GitHub або використовуйте Git LFS.
- Якщо ви випадково додали великі файли і вони відхиляються при пуші — рішення: або видалити їх з історії (git-filter-repo / BFG), або пересоздати репозиторій без node_modules (як зроблено зараз).

---

## Поради та типові проблеми

- "Не вдається підключитися до БД": перевірте `DATABASE_URL` у `backend/.env` і що PostgreSQL слухає на відповідному порту.
- "Помилка під час пушу: file exceeds 100MB": додайте файл у `.gitignore` і видаліть з індексу або виконайте очистку історії, або завантажте файл у Git LFS / Releases.
- Якщо фронтенд показує помилки про CSS (`@import must precede...`) — переконайтесь, що у `frontend/src/styles.css` імпорт шрифтів стоїть у першому рядку.

---

## Архітектура та подальший розвиток

- Поточний MVP включає базову автентифікацію JWT, ролі ADMIN/USER, логування дій (`logs`) та базові CRUD для документів/пристроїв.
- Далі можна додати: збереження файлів у S3/Minio, нотифікації (email/desktop), автоматичне сповіщення про низький рівень тонеру/паперу, інтеграції з держреєстрами.

---

## Як зробити внесок

1. Форкніть репозиторій
2. Створіть гілку `feature/ваша-фіча`
3. Робіть маленькі коміти і відкривайте PR у основний репозиторій

---

Якщо хочете, я можу додати розділ "Запуск в Electron" або підготувати GitHub Actions для CI/Release. Скажіть — і я додам.

***
Автор: Bensikk — команда DocFlow

***

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