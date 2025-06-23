# Basketball Team Management API - Node.js + Express + MySQL

## 📋 Descripción
API REST para la gestión de equipos de baloncesto que permite administrar jugadores y coordinadores. El sistema incluye autenticación, rate limiting y operaciones CRUD completas.

**Propósito principal**: Proporcionar una plataforma robusta para la gestión de datos de jugadores y autenticación de coordinadores en equipos de baloncesto.

**Tecnologías principales utilizadas**:
- Node.js 22
- Express.js 5.1.0
- MySQL 8.0
- Sequelize ORM 6.37.7
- Docker & Docker Compose
- Jest para testing
- bcrypt para hash de contraseñas
- express-rate-limit para limitación de intentos

**Funcionalidades clave**:
- CRUD completo de jugadores (nombre, posición, equipo, edad)
- Sistema de autenticación de coordinadores
- Rate limiting para prevenir ataques de fuerza bruta
- Containerización con Docker
- Suite completa de pruebas unitarias
- Validación de datos con Sequelize
- Manejo robusto de errores

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js >= 18.0.0
- Docker >= 20.0.0
- Docker Compose >= 2.0.0
- MySQL 8.0 (si se ejecuta sin Docker)

### Pasos de instalación

1. **Clonación del repositorio**
```bash
git clone https://github.com/sacom14/node_security_backend
cd Node_UA4_AA
```

2. **Instalación de dependencias**
```bash
npm install
```

3. **Configuración de variables de entorno**
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita las variables según tu configuración
# Las variables principales están en .env
```

4. **Ejecución del servidor**

**Opción 1: Con Docker (Recomendado)**
```bash
docker-compose up -d
```

**Opción 2: Desarrollo local**
```bash
npm run dev
```

**Opción 3: Producción**
```bash
npm start
```

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Ejecuta la aplicación en modo producción |
| `npm run dev` | Ejecuta la aplicación en modo desarrollo con hot-reload |
| `npm test` | Ejecuta todas las pruebas unitarias con coverage |

## 📁 Estructura del Proyecto

```
Node_UA4_AA/
├── 📂 config/                 # Configuración de base de datos
│   └── db.js                  # Conexión Sequelize a MySQL
├── 📂 controllers/            # Lógica de negocio
│   ├── authController.js      # Autenticación de coordinadores
│   └── playerController.js    # Gestión de jugadores
├── 📂 middlewares/            # Middlewares personalizados
│   └── authMiddleware.js      # Rate limiting para login
├── 📂 models/                 # Modelos de datos Sequelize
│   ├── auth.js               # Modelo Coordinator
│   └── player.js             # Modelo Player
├── 📂 routes/                 # Definición de rutas
│   ├── authRouter.js         # Rutas de autenticación
│   └── playerRouter.js       # Rutas de jugadores
├── 📂 tests/                  # Suite de pruebas unitarias
│   ├── authController.test.js
│   ├── authMiddleware.test.js
│   └── playerController.test.js
├── 📂 coverage/               # Reportes de cobertura de pruebas
├── 🐳 docker-compose.yml      # Orquestación de contenedores
├── 🐳 Dockerfile             # Imagen de la aplicación
├── 📋 app.js                 # Punto de entrada principal
├── 📋 package.json           # Dependencias y scripts
├── 🔧 .env                   # Variables de entorno
└── 📖 README.md              # Documentación del proyecto
```

**Nota sobre organización**: La estructura sigue el patrón MVC adaptado para APIs REST, separando claramente la lógica de negocio, el acceso a datos y las rutas.

## 📄 Descripción Detallada de Archivos

### Archivos Principales

**`app.js`** - Punto de entrada de la aplicación
- Configura Express y middlewares globales
- Establece conexión con la base de datos con reintentos automáticos
- Define las rutas principales de la API

**`docker-compose.yml`** - Orquestación de servicios
- Define el servicio MySQL con persistencia de datos
- Configura la aplicación Node.js con dependencias
- Establece red interna para comunicación entre contenedores

### Directorios

**`config`** - Configuración de infraestructura
- `db.js`: Conexión Sequelize con MySQL usando variables de entorno

**`controllers`** - Lógica de negocio
- `authController.js`: Login, registro y eliminación de coordinadores
- `playerController.js`: CRUD completo de jugadores

**`middlewares`** - Middlewares personalizados
- `authMiddleware.js`: Rate limiting configurable para login

**`models`** - Modelos de datos
- `auth.js`: Modelo `Coordinator` con validaciones de email y contraseña
- `player.js`: Modelo `Player` con campos obligatorios

**`routes`** - Definición de endpoints
- `authRouter.js`: Rutas `/auth` con middleware de rate limiting
- `playerRouter.js`: Rutas `/players` sin autenticación

**`tests`** - Pruebas unitarias
- Cobertura completa de controladores y middlewares
- Mocking de dependencias externas (Sequelize, bcrypt)

## 🛣️ API Routes - Documentación Detallada

### 🔐 Autenticación (`/auth`)

#### POST `/auth/register`
**Propósito**: Registrar un nuevo coordinador  
**Body**:
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```
**Respuesta exitosa (201)**:
```json
{
  "message": "Registration successful"
}
```
**Errores comunes**:
- `400`: Email ya registrado
- `500`: Error interno del servidor

#### POST `/auth/login`
**Propósito**: Autenticar coordinador (con rate limiting)  
**Body**:
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```
**Respuesta exitosa (200)**:
```json
{
  "message": "Login successful"
}
```
**Errores comunes**:
- `401`: Credenciales incorrectas
- `429`: Demasiados intentos (rate limit)
- `500`: Error interno del servidor

#### DELETE `/auth/:id`
**Propósito**: Eliminar coordinador por ID  
**Respuesta exitosa (204)**: Sin contenido  
**Errores comunes**:
- `404`: Coordinador no encontrado
- `500`: Error interno del servidor

### 👥 Gestión de Jugadores (`/players`)

#### GET `/players`
**Propósito**: Obtener todos los jugadores  
**Respuesta exitosa (200)**:
```json
[
  {
    "id": 1,
    "name": "Lionel Messi",
    "position": "Forward",
    "team": "PSG",
    "age": 36,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST `/players`
**Propósito**: Crear un nuevo jugador  
**Body**:
```json
{
  "name": "Kylian Mbappé",
  "position": "Forward",
  "team": "Real Madrid",
  "age": 25
}
```
**Respuesta exitosa (201)**:
```json
{
  "id": 3,
  "name": "Kylian Mbappé",
  "position": "Forward",
  "team": "Real Madrid",
  "age": 25,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT `/players/:id`
**Propósito**: Actualizar jugador existente  
**Body**: Cualquier combinación de campos del jugador  
**Respuesta exitosa (200)**: Jugador actualizado  
**Errores comunes**:
- `404`: Jugador no encontrado

#### DELETE `/players/:id`
**Propósito**: Eliminar jugador por ID  
**Respuesta exitosa (204)**: Sin contenido  
**Errores comunes**:
- `404`: Jugador no encontrado

## 🔧 Funcionalidades Detalladas

### 🔒 Rate Limiting
- **Configuración**: `loginLimiter` en `/auth/login`
- **Límites**: 4 intentos cada 15 minutos (configurable via `.env`)
- **Variables**: `MAX_LOGIN_ATTEMPTS` y `WINDOW_MINUTES`

### 🛡️ Validación de Datos
- **Sequelize Validations**: Email format, password length (6-100 chars)
- **Required Fields**: Todos los campos de jugador son obligatorios
- **Unique Constraints**: Email único para coordinadores

### 🔐 Seguridad
- **Hash de contraseñas**: bcrypt con salt rounds = 10
- **Validación de emails**: Regex incorporado en Sequelize
- **Rate limiting**: Prevención de ataques de fuerza bruta

### 🗄️ Persistencia de Datos
- **Base de datos**: MySQL 8.0 con Sequelize ORM
- **Conexión**: Pool de conexiones con reconexión automática
- **Migraciones**: Auto-sync de modelos en desarrollo

### 🐳 Containerización
- **Multi-stage**: MySQL + Node.js en red privada
- **Persistencia**: Volume para datos de MySQL
- **Variables**: Configuración via environment variables

## 🧪 Pruebas

### Ejecutar pruebas
```bash
npm test
```

### Cobertura de pruebas
- **Controllers**:  `authController` y `playerController`
- **Middlewares**: Simulación de rate limiting en `authMiddleware`

### Ejemplos con cURL

**Registrar coordinador**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Crear jugador**:
```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{"name":"LeBron James","position":"Forward","team":"Lakers","age":39}'
```

## 📊 Configuración Docker

### Variables de entorno importantes
```env
# Base de datos
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=admin
DB_NAME=basketball

# Rate limiting
MAX_LOGIN_ATTEMPTS=4
WINDOW_MINUTES=15

# Puerto de la aplicación
PORT=3000
```

### Comandos Docker útiles
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Reiniciar servicios
docker-compose restart

# Limpiar contenedores
docker-compose down -v
```

## 👤 Información del autor
- **Proyecto**: Basketball Team Management API
- **Versión**: 1.0.0
- **Autor**: Samir Comas Moral
- **Fecha**: junio 2025

---

> ⚠️ **Nota importante**: Este proyecto está configurado para desarrollo. Para producción, se tendría que implementar JWT tokens, HTTPS, y configuración de seguridad adicional.