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
  - {"images": [ {"id": "str", "author_id": "str"} ]}

### POST /images/upload

- **Метод:** POST
- **Endpoint:** /images/upload
- **Заголовки:** Authorization (jwt), Content-Type
- **Тело запроса:**
  - file: UploadFile
- **Возвращает:**
  - {"status": true, "uploaded_file": {"id": "str", "author_id": "str"}}

## Маршруты пользователей

### POST /users/register

- **Метод:** POST
- **Endpoint:** /users/register
- **Тело запроса:**
  - username: str
  - password: str
- **Возвращает:**
  - {"status": true, "jwt": "str"}

### POST /users/login

- **Метод:** POST
- **Endpoint:** /users/login
- **Тело запроса:**
  - username: str
  - password: str
- **Возвращает:**
  - {"status": true, "jwt": "str"}

### GET /users/auth

- **Метод:** GET
- **Endpoint:** /users/auth
- **Заголовки:** Authorization (jwt)
- **Возвращает:**
  - {"user": {"id": "str", "username": "str"}}