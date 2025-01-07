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

// Middleware para agregar los headers de CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Puedes cambiar '*' por tu dominio si quieres ser más específico
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next(); // Pasa al siguiente middleware
});

// Configura CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: 'https://front-party-kids.vercel.app', // La URLS de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeceras permitidas
  credentials: true,  // Si usas cookies o autenticación
};

// Aplica CORS solo para la ruta /api/bookings
app.use(cors(corsOptions));

// Middleware para analizar datos JSON
app.use(express.json());

// Rutas de la API
app.use('/api/bookings', bookingRoutes);

// Exportar la app para que Vercel la maneje
module.exports = app;
