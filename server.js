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

// Aplica CORS de manera global
app.use(cors({
  origin: '*', // Permite todos los orígenes. Mejor especificar uno si es posible.
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));

// Maneja las solicitudes preflight (OPTIONS)

// Middleware para analizar datos JSON
app.use(express.json());

// Rutas de la API
app.use('/api/bookings', bookingRoutes);

// Exportar la app para que Vercel la maneje
module.exports = app;
