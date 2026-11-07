# InstitucionEducativa

TP final de Programación III: un sistema para una institución educativa hecho con el stack MERN (MongoDB, Express, React y Node), con AntD y Material UI para la interfaz.

# Descripción general del módulo

El sistema tiene dos roles que se loguean, y cada uno ve un menú distinto.

**Administrador**
- Da de alta, modifica, lista y elimina **alumnos**, y los asigna a un curso (comisión).
- Administra los **cursos**: cada curso pertenece a un año y tiene asignadas sus materias.
- Administra las **materias** y los **años**, así no dependen solo de la migración inicial.

**Profesor**
- Genera el **boletín de calificaciones** de un alumno, cargando la nota (de 1 a 10) de cada materia del curso al que pertenece.
- Ve el listado de boletines con el promedio de cada uno, puede abrir un boletín, imprimirlo, corregir las notas o eliminarlo.

**Los dos** pueden ver y editar sus datos personales (nombre, apellido y contraseña).

Algunas reglas del sistema:
- Un alumno tiene un solo boletín por curso, y el boletín lleva la nota de todas las materias de ese curso.
- No se puede borrar un curso que tiene alumnos, ni un alumno que tiene boletines, ni una materia o año que se están usando. El sistema avisa qué hay que hacer antes.
- Todas las rutas de la API, menos el login, piden token. Además, cada rol solo puede hacer lo suyo: si un profesor escribe a mano la URL de una pantalla del admin, vuelve al inicio.

# Entidades y relaciones

```
 Rol ◄──── Usuario
 (admin / profesor)

 Anio ◄──── Curso ────► Materia (varias)
              ▲
              │
           Alumno
              ▲
              │
           Boletin ────► Curso
              │
              └── notas: [ { materia ──► Materia, nota: 1 a 10 } ]
```

- **Usuario** → tiene un **Rol**.
- **Curso** → pertenece a un **Anio** y tiene un array de **Materias**.
- **Alumno** → está asignado a un **Curso**.
- **Boletin** → es de un **Alumno** en un **Curso**, y tiene una nota por cada materia de ese curso. También guarda la fecha de creación, y el promedio se calcula al consultarlo.

# Tecnologías

- **Back:** Node + Express, MongoDB con Mongoose, JWT para la sesión, bcrypt para las contraseñas, winston para los logs y migrate-mongo para los datos iniciales.
- **Front:** React con Vite, react-router, axios, AntD y Material UI.

# Requisitos

- **Node.js** 18 o superior (lo probé con Node 24).
- **MongoDB** corriendo en tu compu (lo probé con MongoDB 7.0 Community). MongoDB Compass sirve para mirar los datos, pero no es obligatorio.

# Cómo levantar el proyecto localmente

Hacen falta dos terminales, una para el back y otra para el front.

> **Ojo en Windows con PowerShell:** si `npm` tira el error "la ejecución de scripts está deshabilitada en este sistema", usá `npm.cmd` en lugar de `npm` (por ejemplo `npm.cmd install`). Hace lo mismo.

### 1. Back

```bash
cd BackEnd
cp .env.example .env
npm install
npm run migrate-dev up
npm run dev
```

- `cp .env.example .env` crea tu archivo de configuración. En PowerShell es `Copy-Item .env.example .env`. Conviene cambiar `JWT_SECRET` por un texto largo cualquiera.
- `npm run migrate-dev up` carga los datos iniciales (roles, usuarios, años, materias, cursos, alumnos y dos boletines de ejemplo). Para deshacerlas: `npm run migrate-dev down`, que deshace la última, así que se repite hasta vaciar. Para ver cuáles están aplicadas: `npm run migrate-dev status`.
- `npm run dev` levanta la API en `http://localhost:4000`.

### 2. Front

```bash
cd FrontEnd
cp .env.example .env
npm install
npm run dev
```

La terminal va a mostrar algo como `Local: http://localhost:5173/`. Abrilo en el navegador (Ctrl + click sobre el link) y entrás al login.

### Variables de entorno

**BackEnd/.env**

| Variable | Para qué es | Ejemplo |
|---|---|---|
| `PORT` | Puerto de la API | `4000` |
| `MONGO_URL` | Dónde está MongoDB | `mongodb://127.0.0.1:27017/` |
| `MONGO_DB` | Nombre de la base | `institucion_educativa` |
| `JWT_SECRET` | Clave con la que se firman los tokens | un texto largo |
| `JWT_ISSUER` | Emisor del token | `institucion-educativa` |
| `JWT_EXPIRES_IN` | Cuánto dura la sesión | `8h` |
| `LOG_LEVEL` | Detalle de los logs (`error`, `warn`, `info`, `debug`) | `info` |

**FrontEnd/.env**

| Variable | Para qué es | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL del back | `http://localhost:4000/` |

# Usuarios de prueba

Los carga la migración inicial.

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@baseapinode.com` | `Password1` |
| Profesor | `glarriera@baseapinode.com` | `Password1` |
| Profesor | `clopez@baseapinode.com` | `Password1` |

Con el profesor ya hay dos boletines cargados (Nestor del Rio y Juan Perez). Maria, Pedro y Lucia todavía no tienen boletín, así que sirven para probar cómo se crea uno.

# Pantallas

| Ruta | Rol | Qué hace |
|---|---|---|
| `/` | todos | Login |
| `/Inicio` | todos | Bienvenida |
| `/DatosPersonales` | todos | Ver y editar los datos propios |
| `/Alumnos/Listado`, `/Alumnos/Crear`, `/Alumnos/Modificar` | admin | ABM de alumnos |
| `/Cursos/Listado`, `/Cursos/Crear`, `/Cursos/Modificar` | admin | ABM de cursos |
| `/Materias/Listado`, `/Materias/Crear`, `/Materias/Modificar/:id` | admin | ABM de materias |
| `/Anios/Listado`, `/Anios/Crear`, `/Anios/Modificar/:id` | admin | ABM de años |
| `/Boletines/Listado` | profesor | Listado de boletines con su promedio |
| `/Boletines/Crear` | profesor | Generar el boletín de un alumno |
| `/Boletines/Ver/:id` | profesor | Ver e imprimir un boletín |
| `/Boletines/Editar/:id` | profesor | Corregir las notas de un boletín |

# Logs y errores

- Los logs del back se guardan en **`BackEnd/logs/`**:
  - `error.log`: solo los errores del servidor, con el detalle para encontrar dónde falló.
  - `combined.log`: todo, incluido cada pedido que llega a la API.
- La carpeta se crea sola al levantar el back y no se sube al repo.
- Cuando algo falla, la API responde con el status que corresponde (400, 401, 403, 404 o 500) y un `{ "mensaje": "..." }` entendible. El front muestra ese mensaje en un aviso abajo a la derecha.

# Estructura

```
BackEnd/
  app.js            Express: middlewares, rutas y manejo de errores
  bin/www           Arranque del servidor y conexión a Mongo
  routes/           Un archivo por entidad (alumno, curso, boletin, ...)
  schemas/          Modelos de Mongoose
  middlewares/      authentication (JWT) y authorization (permitirRoles)
  migrations/       Datos iniciales (migrate-mongo)
  utils/            Generación del token y logger
FrontEnd/src/
  App.jsx           Rutas del front
  components/       RutaProtegida (control de sesión y rol)
  modules/          Una carpeta por pantalla
  services/         Llamadas a la API (axios), una carpeta por entidad
```
