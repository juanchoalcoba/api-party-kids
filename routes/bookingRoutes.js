const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una nueva reserva
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


// Eliminar una reserva por _id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;  // Obtenemos el ID de los parámetros de la URL

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




// NUEVO ENDPOINT: Obtener solo las fechas reservadas
router.get('/booked-dates', async (req, res) => {
  try {
    const bookings = await Booking.find().select('date -_id'); // Selecciona solo las fechas sin el _id
    const bookedDates = bookings.map(booking => booking.date); // Extrae solo las fechas en un array
    res.json(bookedDates); // Envia las fechas reservadas como respuesta
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
