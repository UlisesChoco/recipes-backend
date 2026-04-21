# Recipes Backend API

API REST construida con NestJS y TypeScript.

## Setup

El proyecto está dockerizado y puede levantarse junto al frontend con Docker Compose.

### Requisitos

- Docker
- Docker Compose

### 1) Clonar repositorios

```bash
mkdir recipes-app
cd recipes-app
git clone https://github.com/UlisesChoco/recipes-backend
git clone https://github.com/UlisesChoco/recipes-frontend
```

### 2) Configurar variables de entorno

En el backend, crear el archivo `.env` a partir de `.env-template`:

```bash
cp recipes-backend/.env-template recipes-backend/.env
```

### 3) Crear docker-compose.yml en la raíz

```bash
touch docker-compose.yml
```

Contenido sugerido de `docker-compose.yml`:

```yaml
services:
	recipes-backend:
		build: ./recipes-backend
		container_name: recipes_backend
		ports:
			- "3000:3000"
		env_file:
			- ./recipes-backend/.env
		depends_on:
			db:
				condition: service_healthy

	db:
		image: mysql:8.4.8
		container_name: mysql_db
		restart: unless-stopped
		environment:
			MYSQL_ROOT_PASSWORD: root
			MYSQL_DATABASE: recipes
		ports:
			- "3306:3306"
		volumes:
			- db_data:/var/lib/mysql
			- ./recipes-backend/sql/init.sql:/docker-entrypoint-initdb.d/init.sql
		healthcheck:
			test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
			interval: 5s
			timeout: 5s
			retries: 10

	recipes-frontend:
		build:
			context: ./recipes-frontend
			args:
				VITE_API_URL: http://localhost:3000
		container_name: recipes_frontend
		ports:
			- "80:80"

volumes:
	db_data:
```

### 4) Levantar la aplicación

```bash
docker compose up --build -d
```

### 5) Servicios levantados

- `recipes_backend`: API NestJS en puerto `3000`
- `recipes_frontend`: Frontend React en puerto `80`
- `mysql_db`: MySQL en puerto `3306`

### 6) Acceso

- Frontend: http://localhost:80
- Backend API: http://localhost:3000

## Stack y arquitectura

- Framework: NestJS
- Lenguaje: TypeScript
- Base de datos: MySQL (relacional)
- ORM: TypeORM

### Esquema de base de datos

<img width="494" height="423" alt="der" src="https://github.com/user-attachments/assets/7a2849ca-b795-4bdb-9299-f3ea20375dac" />

Aunque se utiliza TypeORM para repositorios y consultas, **el proyecto no depende de la generación automática de esquema por anotaciones del ORM**. El esquema y relaciones se crean desde el script SQL en [sql/init.sql](sql/init.sql), y la app corre con `synchronize: false`.

## Gestión del proyecto

Tanto para el backend como el frontend, se usó la plataforma Jira para la gestión de tickets como medio de mejor organización, vinculando el mensaje de los commits con IDs de tickets Jira.

<img width="1196" height="498" alt="image" src="https://github.com/user-attachments/assets/b5fb7a21-8c52-45c1-8fec-0344dda04c39" />

## Features

### Almacenamiento local de imágenes

- Las imágenes de recetas se guardan en disco local dentro de la carpeta `uploads` (en runtime).
- La API guarda archivos físicamente en backend y expone esa carpeta en `/uploads` mediante `ServeStaticModule`.
- En MySQL, la tabla `recipe` almacena **solo el nombre del archivo** en la columna `image`.

Ejemplo:

- Valor almacenado en BD: `1713758123456-pasta.jpeg`
- URL pública consumible por frontend: `http://api/uploads/1713758123456-pasta.jpeg`

Nota: en desarrollo local, `api` suele mapear al host del backend (por ejemplo `http://localhost:3000/uploads/...`).

### Seguridad

- Los endpoints protegidos esperan header `Authorization: Bearer <JWT>`.
- El JWT se obtiene en `POST /auth/login`.

## Validaciones y errores comunes

- Se usan validaciones con `class-validator` y `ValidationPipe` global.
- Si el body incluye propiedades no permitidas o tipos inválidos, la API responde `400 Bad Request`.
- Errores no controlados responden `500 Internal Server Error`.

## Endpoints REST

Base URL: `http://localhost:3000`

---

### Auth

#### 1. Registro

- Tipo: `POST`
- URL: `/auth/register`

Request body (JSON):

```json
{
	"name": "Juan",
	"surname": "Perez",
	"email": "juan@mail.com",
	"password": "Abcdef12"
}
```

Response body `201 Created`:

```json
{
	"name": "Juan",
	"surname": "Perez",
	"email": "juan@mail.com"
}
```

Códigos HTTP posibles:

- `201 Created`: usuario registrado.
- `400 Bad Request`: email ya existente o body inválido.

#### 2. Login

- Tipo: `POST`
- URL: `/auth/login`

Request body (JSON):

```json
{
	"email": "juan@mail.com",
	"password": "Abcdef12"
}
```

Response body `200 OK`:

```json
{
	"token": "<jwt-token>"
}
```

Códigos HTTP posibles:

- `200 OK`: autenticación exitosa.
- `400 Bad Request`: body inválido.
- `401 Unauthorized`: credenciales inválidas.

---

### Users

#### 3. Buscar usuario por email

- Tipo: `GET`
- URL: `/users?email={email}`

Request body: no aplica.

Response body `200 OK`:

```json
{
	"name": "Juan",
	"surname": "Perez",
	"email": "juan@mail.com"
}
```

Códigos HTTP posibles:

- `200 OK`: usuario encontrado.
- `404 Not Found`: usuario inexistente.

---

### Recipes (protegido con JWT)

#### 4. Listar recetas públicas

- Tipo: `GET`
- URL: `/recipes`
- Auth: Bearer token requerido.

Request body: no aplica.

Response body `200 OK`:

```json
[
	{
		"id": 1,
		"title": "Pasta casera",
		"description": "Receta simple",
		"image": "1713758123456-pasta.jpeg",
		"user": {
			"name": "Juan",
			"surname": "Perez"
		}
	}
]
```

Códigos HTTP posibles:

- `200 OK`: listado obtenido.
- `401 Unauthorized`: token ausente/inválido.

#### 5. Listar mis recetas

- Tipo: `GET`
- URL: `/recipes/me`
- Auth: Bearer token requerido.

Request body: no aplica.

Response body `200 OK`:

```json
[
	{
		"id": 1,
		"title": "Pasta casera",
		"description": "Receta simple",
		"image": "1713758123456-pasta.jpeg"
	}
]
```

Códigos HTTP posibles:

- `200 OK`: listado obtenido.
- `401 Unauthorized`: token ausente/inválido.

#### 6. Obtener receta por ID

- Tipo: `GET`
- URL: `/recipes/:id`
- Auth: Bearer token requerido.

Request body: no aplica.

Response body `200 OK`:

```json
{
	"id": 1,
	"title": "Pasta casera",
	"description": "Receta simple",
	"image": "1713758123456-pasta.jpeg",
	"user": {
		"name": "Juan",
		"surname": "Perez"
	},
	"ingredients": [
		{
			"name": "Harina",
			"amount": 500,
			"unit": "g"
		}
	]
}
```

Códigos HTTP posibles:

- `200 OK`: receta encontrada.
- `400 Bad Request`: `id` inválido.
- `401 Unauthorized`: token ausente/inválido.
- `404 Not Found`: receta no existe.

#### 7. Crear receta

- Tipo: `POST`
- URL: `/recipes`
- Auth: Bearer token requerido.
- Content-Type: `multipart/form-data`

Campos esperados (multipart):

- `image`: archivo de imagen.
- `data`: string JSON con este formato:

```json
{
	"title": "Pasta casera",
	"description": "Receta simple",
	"ingredients": [
		{
			"name": "Harina",
			"amount": 500,
			"unit": "g"
		}
	]
}
```

Response body `201 Created`:

```json
{
	"title": "Pasta casera",
	"description": "Receta simple",
	"image": "1713758123456-pasta.jpeg",
	"ingredients": [
		{
			"name": "Harina",
			"amount": 500,
			"unit": "g"
		}
	]
}
```

Códigos HTTP posibles:

- `201 Created`: receta creada.
- `400 Bad Request`: JSON inválido en `data`, validaciones fallidas o receta sin ingredientes.
- `401 Unauthorized`: token ausente/inválido.
- `500 Internal Server Error`: error al persistir o al guardar imagen.

#### 8. Actualizar receta

- Tipo: `PATCH`
- URL: `/recipes/:id`
- Auth: Bearer token requerido.
- Content-Type: `multipart/form-data`

Campos esperados (multipart):

- `image`: archivo opcional (si se envía, reemplaza la imagen previa).
- `data`: string JSON con el mismo formato que create:

```json
{
	"title": "Pasta integral",
	"description": "Versión actualizada",
	"ingredients": [
		{
			"name": "Harina integral",
			"amount": 400,
			"unit": "g"
		}
	]
}
```

Response body `200 OK`:

```json
{
	"title": "Pasta integral",
	"description": "Versión actualizada",
	"image": "1713758999999-pasta-integral.jpeg",
	"ingredients": [
		{
			"name": "Harina integral",
			"amount": 400,
			"unit": "g"
		}
	]
}
```

Códigos HTTP posibles:

- `200 OK`: receta actualizada.
- `400 Bad Request`: `id` inválido, JSON inválido en `data`, body inválido o ingredientes vacíos.
- `401 Unauthorized`: token ausente/inválido.
- `404 Not Found`: receta inexistente o no pertenece al usuario autenticado.
- `500 Internal Server Error`: error transaccional o de archivos.

#### 9. Eliminar receta

- Tipo: `DELETE`
- URL: `/recipes/:id`
- Auth: Bearer token requerido.

Request body: no aplica.

Response body `204 No Content` (sin cuerpo).

Códigos HTTP posibles:

- `204 No Content`: receta eliminada.
- `400 Bad Request`: `id` inválido.
- `401 Unauthorized`: token ausente/inválido.
- `404 Not Found`: receta inexistente o no pertenece al usuario autenticado.

---

### Ratings (protegido con JWT)

#### 10. Crear o actualizar rating de receta

- Tipo: `POST`
- URL: `/ratings`
- Auth: Bearer token requerido.

Request body (JSON):

```json
{
	"score": 5,
	"comment": "Excelente receta",
	"recipeId": 1
}
```

Response body `201 Created`:

```json
{
	"score": 5,
	"comment": "Excelente receta"
}
```

Nota: este endpoint hace upsert lógico por usuario+receta (si ya existe rating, lo actualiza).

Códigos HTTP posibles:

- `201 Created`: rating creado o actualizado.
- `400 Bad Request`: body inválido.
- `401 Unauthorized`: token ausente/inválido.
- `404 Not Found`: receta no existe.

#### 11. Listar ratings de una receta

- Tipo: `GET`
- URL: `/recipes/:recipeId/ratings`
- Auth: Bearer token requerido.

Request body: no aplica.

Response body `200 OK`:

```json
[
	{
		"score": 5,
		"comment": "Excelente receta",
		"user": {
			"name": "Juan",
			"surname": "Perez"
		}
	}
]
```

Códigos HTTP posibles:

- `200 OK`: ratings obtenidos.
- `400 Bad Request`: `recipeId` inválido.
- `401 Unauthorized`: token ausente/inválido.

## Variables de entorno

Basadas en [.env-template](.env-template):

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
