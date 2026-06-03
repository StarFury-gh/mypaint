## Схемы базы данных

### Таблица users

- `id`: UUID (primary key)
- `username`: VARCHAR (unique)
- `password`: VARCHAR (хэш SHA-256)
- `created_at`: TIMESTAMP

### Таблица paintings

- `id`: UUID (primary key)
- `title`: VARCHAR
- `author_id`: UUID (foreign key to `users.id`)
- `path`: VARCHAR (путь к файлу изображения)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
