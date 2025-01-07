const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

app.use(cors({
  origin: 'https://front-party-kids.vercel.app/', // El origen exacto de tu frontend desplegado en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir los métodos HTTP necesarios
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));


// Inicializar la app de Express
const app = express();
// Middleware para analizar datos JSON
app.use(express.json());

// Rutas de la API
app.use('/api/bookings', bookingRoutes);

// Exportar la app para que Vercel la maneje
module.exports = app;
