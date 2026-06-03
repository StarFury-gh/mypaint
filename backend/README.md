# API Документация

## Маршруты изображений

### GET /images

- **Метод:** GET
- **Endpoint:** /images
- **Заголовки:** Authorization (jwt)
- **Параметры запроса:**
  - limit: int (по умолчанию 5)
  - offset: int (по умолчанию 0)
- **Возвращает:**
  - `{"images": [{"id": "str", "author_id": "str", "title": "str", "path": "str", "created_at": "str | null", "updated_at": "str | null"}]}`
- **Описание:** Возвращает список изображений текущего пользователя с пагинацией

### GET /images/{image_id}

- **Метод:** GET
- **Endpoint:** /images/{image_id}
- **Заголовки:** Authorization (jwt)
- **Параметры пути:**
  - image_id: str
- **Возвращает:**
  - `{"image": {"id": "str", "author_id": "str", "title": "str", "path": "str", "created_at": "str | null", "updated_at": "str | null"}}`
- **Описание:** Возвращает конкретное изображение по ID
- **Ошибки:**
  - 403 Forbidden: Authorization required
  - 404 Not Found: Image not found

### POST /images/upload

- **Метод:** POST
- **Endpoint:** /images/upload
- **Заголовки:** Authorization (jwt)
- **Тело запроса (JSON):**
  - img: str (base64 строка изображения)
  - title: str
- **Возвращает:**
  - `{"status": true, "uploaded_file": {"id": "str", "author_id": "str", "title": "str", "path": "str"}}`
- **Описание:** Загружает изображение в формате base64
- **Ошибки:**
  - 401 Unauthorized: Authorization required
  - 400 Bad Request: Base64 is required / Title is required
  - 401 Unauthorized: User does not exists
  - 500 Internal Server Error

### PATCH /images/update

- **Метод:** PATCH
- **Endpoint:** /images/update
- **Заголовки:** Authorization (jwt)
- **Тело запроса (JSON):**
  - id: str (ID изображения для обновления)
  - img: str (base64 строка нового изображения)
  - new_title: str | null (новый заголовок, необязательный)
- **Возвращает:**
  - `{"status": true, "updated": {"title": "str"}}`
- **Описание:** Обновляет содержимое и/или заголовок изображения
- **Ошибки:**
  - 401 Unauthorized: Authorization required
  - 400 Bad Request: Image is required
  - 404 Not Found: Image not found

### DELETE /images/{image_id}

- **Метод:** DELETE
- **Endpoint:** /images/{image_id}
- **Заголовки:** Authorization (jwt)
- **Параметры пути:**
  - image_id: str
- **Возвращает:**
  - `{"status": true, "deleted": {"title": "str"}}`
- **Описание:** Удаляет изображение по ID
- **Ошибки:**
  - 401 Unauthorized: Authorization required
  - 404 Not Found: Image not found

## Маршруты пользователей

### POST /users/register

- **Метод:** POST
- **Endpoint:** /users/register
- **Тело запроса (JSON):**
  - username: str
  - password: str
- **Возвращает:**
  - `{"status": true, "jwt": "str"}`
- **Описание:** Регистрирует нового пользователя и возвращает JWT токен
- **Ошибки:**
  - 409 Conflict: User already exist
  - 500 Internal Server Error

### POST /users/login

- **Метод:** POST
- **Endpoint:** /users/login
- **Тело запроса (JSON):**
  - username: str
  - password: str
- **Возвращает:**
  - `{"status": true, "jwt": "str"}`
- **Описание:** Аутентифицирует пользователя и возвращает JWT токен
- **Ошибки:**
  - 401 Unauthorized: Invalid credentials

### GET /users/auth

- **Метод:** GET
- **Endpoint:** /users/auth
- **Заголовки:** Authorization (jwt)
- **Возвращает:**
  - `{"user": {"id": "str", "username": "str"}}`
- **Описание:** Возвращает информацию о текущем авторизованном пользователе
- **Ошибки:**
  - 401 Unauthorized: No jwt provided

## Прочие маршруты

### GET /health

- **Метод:** GET
- **Endpoint:** /health
- **Возвращает:**
  - `{"status": "healthy"}`
- **Описание:** Проверка состояния сервера

## Примеры запросов

### Загрузка изображения

```bash
curl -X POST http://localhost:8000/images/upload \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "title": "Мое изображение"
  }'
```

### Получение списка изображений

```bash
curl -X GET "http://localhost:8000/images?limit=10&offset=0" \
  -H "Authorization: YOUR_JWT_TOKEN"
```

### Обновление изображения

```bash
curl -X PATCH http://localhost:8000/images/update \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "some-image-id",
    "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "new_title": "Обновленное название"
  }'
```

## Структура JWT токена

JWT токен используется для аутентификации на защищенных маршрутах. Он должен быть передан в заголовке `Authorization` в формате `<token>`.

Полезная нагрузка токена содержит:

- `id`: ID пользователя (строка)
- `username`: Имя пользователя (строка)
