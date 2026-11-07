const fs = require('fs')
const path = require('path')
const winston = require('winston')

// Carpeta donde se guardan los archivos de log (BackEnd/logs)
/* eslint-disable-next-line no-undef */
const carpetaLogs = path.join(__dirname, '../logs')
fs.mkdirSync(carpetaLogs, { recursive: true })

// Formato de cada linea: fecha [nivel] mensaje
const formatoLinea = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`,
)

const logger = winston.createLogger({
  /* eslint-disable-next-line no-undef */
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    formatoLinea,
  ),
  transports: [
    // Solo los errores
    new winston.transports.File({ filename: path.join(carpetaLogs, 'error.log'), level: 'error' }),
    // Todo (pedidos, avisos y errores)
    new winston.transports.File({ filename: path.join(carpetaLogs, 'combined.log') }),
    // Tambien por consola, con colores
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), formatoLinea),
    }),
  ],
})

module.exports = logger
