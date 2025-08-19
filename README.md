# GeoDash API – Backend

Plataforma backend para experiencias de aprendizaje gamificadas en geografía. Construido con Node.js, Express y MongoDB, este servicio expone una API REST preparada para crecer con módulos de juego (niveles, puntos, logros, rankings) y analítica educativa.

## Tabla de contenidos
- Introducción
- Características
- Stack Tecnológico
- Requisitos previos
- Instalación
- Configuración (.env)
- Ejecución
- Estructura del proyecto
- Arquitectura y módulos actuales
- Seguridad y buenas prácticas
- Despliegue (local y Atlas)
- Solución de problemas
- Roadmap
- Licencia

## Introducción
GeoDash Backend es una API RESTful diseñada para impulsar experiencias de aprendizaje gamificadas en geografía. Con MongoDB como base, ofrece una arquitectura flexible y escalable que permite a los jugadores explorar el mundo a través de desafíos educativos interactivos y sistemas de progresión motivadores.

## Características
🎮 Sistema de Gamificación Completo
- Gestión de niveles, puntos de experiencia y rachas semanales personalizables
- Sistema de logros y badges desbloqueables por categorías geográficas
- Rankings y estadísticas mediante agregaciones optimizadas

📚 Gestión Flexible de Contenido Educativo
- Modelo NoSQL adaptable para múltiples tipos de preguntas geográficas
- Categorización dinámica (países, capitales, geografía física, clima)
- Dificultad adaptativa basada en el rendimiento del usuario

👤 Autenticación y Perfiles Avanzados
- Autenticación JWT con `refresh tokens` (planificado)
- Perfiles de usuario con avatares y preferencias (planificado)
- Historial de partidas y análisis por categorías (planificado)

⚡ Arquitectura MongoDB Optimizada
- Desarrollo local con MongoDB Community + Compass
- Producción con MongoDB Atlas (desde free tier hasta enterprise)
- Aggregation Framework para estadísticas y rankings
- Esquemas flexibles para evolución rápida de funcionalidades

> Estado actual: servidor Express operativo, conexión a MongoDB mediante Mongoose, middlewares de seguridad y utilidad para emisión de JWT. Los módulos de dominio (usuarios, preguntas, partidas, logros) se integrarán en iteraciones siguientes.

## Stack Tecnológico
- Node.js + Express
- MongoDB (Community para desarrollo / Atlas para producción)
- Mongoose (ODM)
- Seguridad: Helmet, CORS, `express-rate-limit`, JWT
- Utilidades: Morgan (logs), `express-validator` (validación), Argon2 (hashing, preparado)

## Requisitos previos
- Node.js 18 o superior
- MongoDB 6+ (local) o una cuenta de MongoDB Atlas
- npm 9+ (recomendado)

## Instalación
```bash
npm install
```

## Configuración (.env)
Crea un archivo `.env` en la raíz del proyecto con al menos:
```env
# Puerto del servidor Express
PORT=3000

# Conexión a MongoDB local
MONGO_URI=mongodb://127.0.0.1:27017/geodash

# Clave para firmar JWT (mantener en secreto en producción)
SECRET_KEY=cambia-esta-clave-en-produccion
```

Para MongoDB Atlas, la variable `MONGO_URI` suele tener formato SRV:
```env
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/?retryWrites=true&w=majority
```

## Ejecución
- Desarrollo (recarga automática con nodemon):
```bash
npm run dev
```

- Producción:
```bash
npm start
```

## Estructura del proyecto
```
Geodash_Backend/
├─ config/
│  ├─ app.js              # Configuración de middlewares y arranque del servidor
│  └─ mongo.js            # Conexión y eventos de Mongoose
├─ middlewares/
│  ├─ rate.limit.js       # Limitador de peticiones
│  └─ validate.errors.js  # Helper para errores de validación
├─ utils/
│  └─ jwt.js              # Generación de JWT
├─ index.js               # Punto de entrada (carga .env, conecta DB, inicia server)
├─ package.json
└─ README.md
```

## Arquitectura y módulos actuales
- `index.js`: carga variables de entorno, conecta a MongoDB y levanta el servidor Express.
- `config/app.js`: aplica `helmet`, `cors`, `morgan`, `express.json`, `express.urlencoded` y `express-rate-limit`. Escucha en `process.env.PORT`.
- `config/mongo.js`: gestiona la conexión Mongoose y registra eventos de conexión/desconexión/reintento.
- `utils/jwt.js`: utilitario para firmar JWT con algoritmo HS256 y expiración de 1h.
- `middlewares/rate.limit.js`: política básica de rate limiting (ventana de 10 min, 500 req).
- `middlewares/validate.errors.js`: integración con `express-validator` para responder 400 con los errores.

> Notas: aún no se han expuesto rutas de dominio. Se recomienda agregar routers bajo `src/` (por ejemplo `src/users`, `src/auth`, `src/games`) e importarlos en `config/app.js`.

## Seguridad y buenas prácticas
- Mantén `SECRET_KEY` fuera del repositorio y rota credenciales periódicamente.
- Configura CORS con listas de orígenes permitidos en producción.
- Ajusta el rate limit según el caso de uso y el front.
- Usa Argon2 o bcrypt para hashing de contraseñas (Argon2 ya está en dependencias).
- Habilita logs estructurados y monitoreo en entornos productivos.

## Despliegue
### Local (MongoDB Community)
1. Inicia tu instancia de MongoDB local.
2. Configura `MONGO_URI` apuntando a tu instancia local.
3. Ejecuta `npm start`.

### MongoDB Atlas
1. Crea un cluster y un usuario de base de datos.
2. Habilita tu IP en Network Access.
3. Usa la cadena SRV en `MONGO_URI`.

## Solución de problemas
- El servidor no inicia y no hay `PORT`: agrega `PORT` al `.env`.
- Error de conexión a MongoDB: revisa `MONGO_URI`, acceso de red/whitelist e IP pública en Atlas.
- `SECRET_KEY` ausente: define `SECRET_KEY` en `.env` para firmar JWT.

## Roadmap
- Módulo de autenticación completo (login/registro, refresh tokens, recuperación)
- Gestión de perfiles y preferencias de usuario
- Banco de preguntas geográficas y categorización
- Lógica de partidas, niveles, XP y rachas
- Sistema de logros/badges y rankings globales
- Analítica con Aggregation Pipeline y panel de estadísticas
- Documentación OpenAPI/Swagger

## Licencia
MIT. Consulta el archivo `LICENSE` para más detalles.
