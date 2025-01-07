const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Booking = require('./models/Booking'); // Importar el modelo directamente
const bookingRoutes = require('./routes/bookingRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar la app de Express
const app = express();

const corsOptions = {
  origin: 'https://front-party-kids.vercel.app', // URL exacta del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
  credentials: true, // Permitir el uso de cookies/autenticación
};

// Middleware para CORS
app.use(cors(corsOptions));

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// Habilitar solicitudes preflight (para DELETE, POST, PUT, etc.)
app.options('*', cors(corsOptions));

// Rutas de la API
app.use('/api/bookings', bookingRoutes); // Mantener las rutas GET y POST en bookingRoutes

// ** NUEVA RUTA DELETE DIRECTAMENTE EN EL SERVER.JS **
app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params.id;

  // Validar si el id es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Eliminar la reserva
    await Booking.deleteOne({ _id: id });
    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Exportar la app para que Vercel la maneje
module.exports = app;
