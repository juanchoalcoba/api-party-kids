const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar la app de Express
const app = express();

// Configuración de CORS manualmente
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite cualquier origen, ajusta esto a tu frontend
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // Métodos permitidos
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Cabeceras permitidas
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Responde con 200 OK para solicitudes preflight
  }
  next(); // Continuar con el siguiente middleware
});

// Middleware para analizar datos JSON
app.use(express.json());

// Rutas de la API
app.use('/api/bookings', bookingRoutes);

// Exportar la app para que Vercel la maneje
module.exports = app;
