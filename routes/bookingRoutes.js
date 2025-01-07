const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');  // Asegúrate de tener este modelo de Booking

const router = express.Router();

// Obtener todas las reservas (GET)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una nueva reserva (POST)
router.post('/', async (req, res) => {
  const { name, email, phone, date } = req.body;

  try {
    const newBooking = new Booking({ name, email, phone, date });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una reserva por _id usando app.delete()
app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;  // Obtenemos el ID de los parámetros de la URL

  // Validar si el id es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const booking = await Booking.findById(id);  // Buscar la reserva por ID

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

module.exports = router;
