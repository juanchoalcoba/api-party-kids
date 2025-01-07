const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar la app de Express
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'https://front-party-kids.vercel.app', // URL exacta del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos, incluidas las solicitudes preflight
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
  credentials: true, // Permitir el uso de cookies/autenticación
};

// Middleware para CORS
app.use(cors(corsOptions));

// Middleware para analizar datos JSON
app.use(express.json());

// Habilitar solicitudes preflight (para DELETE, POST, PUT, etc.)
app.options('*', cors(corsOptions));

// Rutas de la API
app.use('/api/bookings', bookingRoutes);

// Exportar la app para que Vercel la maneje
module.exports = app;
