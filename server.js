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

// Configura CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: 'https://front-party-kids.vercel.app',  // La URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],    // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeceras permitidas
  credentials: true,  // Si usas cookies o autenticación
};

// Aplica CORS solo para la ruta /api/bookings
app.use('/api/bookings', cors(corsOptions));

// Middleware para analizar datos JSON
app.use(express.json());

// Rutas de la API
app.use('/api/bookings', bookingRoutes);

// Exportar la app para que Vercel la maneje
module.exports = app;
