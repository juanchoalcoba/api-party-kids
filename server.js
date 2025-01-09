'use strict'

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


app.use(express.urlencoded({ extended: true }));


// Configuración de CORS
const corsOptions = {
    origin: 'https://front-party-kids.vercel.app', // La URL de tu frontend en Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],  // Cabeceras permitidas
    optionsSuccessStatus: 204,  // Opcional para manejar preflight exitoso
  };
  
  // Aplica CORS a toda la aplicación
  app.use(cors(corsOptions));
  
  // Middleware para manejar las preflight requests (OPTIONS)



// Middleware para analizar datos JSON
app.use(express.json());

// Rutas de la API
app.use('/api/bookings', bookingRoutes);

// Exportar la app para que Vercel la maneje
module.exports = app;
