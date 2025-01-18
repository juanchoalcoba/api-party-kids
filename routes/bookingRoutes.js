'use strict'

const express = require('express');
const Booking = require('../models/Booking');
const mongoose = require("mongoose")
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
// Crear una nueva reserva con validación de franjas horarias
router.post('/', async (req, res) => {
  const { name, namekid, email, phone, date, duration, selectedTime } = req.body;

  try {
    // Convertir la fecha y la hora seleccionada a un objeto Date completo
    const startDateTime = new Date(date);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    startDateTime.setHours(hours, minutes);

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + duration); // Sumar la duración para obtener la hora de fin

    // Buscar reservas en la misma fecha
    const bookings = await Booking.find({ date: startDateTime.toISOString().split('T')[0] });

    // Verificar si la franja horaria está libre
    for (let booking of bookings) {
      const existingStartTime = new Date(booking.date);
      const existingEndTime = new Date(existingStartTime);
      existingEndTime.setHours(existingStartTime.getHours() + booking.duration);

      // Verificar si hay conflictos de horarios
      if (
        (startDateTime >= existingStartTime && startDateTime < existingEndTime) ||
        (endDateTime > existingStartTime && endDateTime <= existingEndTime) ||
        (startDateTime <= existingStartTime && endDateTime >= existingEndTime)
      ) {
        return res.status(400).json({ message: 'La franja horaria ya está reservada.' });
      }
    }

    // Si ya hay dos reservas para el mismo día, deshabilitar el día para nuevas reservas
    if (bookings.length >= 2) {
      return res.status(400).json({ message: 'El día ya tiene dos reservas, no se pueden hacer más.' });
    }

    // Crear la nueva reserva si la franja horaria está libre y no hay más de dos reservas
    const newBooking = new Booking({
      name,
      namekid,
      email,
      phone,
      date: startDateTime, // Guardamos la fecha con la hora seleccionada
      duration,
      selectedTime,
      confirmed: false // Por defecto, las reservas no están confirmadas
    });

    const savedBooking = await newBooking.save(); // Guarda la nueva reserva en la base de datos
    res.status(201).json(savedBooking); // Devuelve la reserva guardada con un código 201 (creado)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.delete('/', async (req, res) => {
  const { name } = req.query;  // Recibimos el 'name' desde los parámetros de la URL

  try {
    // Intentamos eliminar el documento que coincida con el 'name'
    const result = await Booking.deleteOne({ name: name });

    // Verificamos si no se encontró ningún documento
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Si la eliminación fue exitosa
    res.status(200).json({ message: 'Reserva eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando la reserva', error });
  }
});


// Ruta PUT para confirmar una reserva
router.put('/', async (req, res) => {
  const { name } = req.query;  // Recibimos el 'name' desde los parámetros de la URL

  try {
    // Intentamos encontrar y actualizar la reserva que coincida con el 'name'
    const result = await Booking.updateOne(
      { name: name },
      { $set: { confirmed: true } } // Actualizamos el campo 'confirmed' a true
    );

    // Verificamos si no se encontró ningún documento
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada o ya confirmada' });
    }

    // Si la actualización fue exitosa
    res.status(200).json({ message: 'Reserva confirmada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error confirmando la reserva', error });
  }
});




// ENDPOINT: Obtener solo las fechas reservadas
// Obtener solo las fechas completamente reservadas
router.get('/booked-dates', async (req, res) => {
  try {
    const bookings = await Booking.find().select('date -_id'); // Selecciona solo las fechas sin el _id

    // Contar cuántas reservas hay por día
    const bookingCountByDate = {};
    bookings.forEach(booking => {
      const bookingDate = booking.date.toISOString().split('T')[0]; // Solo la parte de la fecha
      bookingCountByDate[bookingDate] = (bookingCountByDate[bookingDate] || 0) + 1;
    });

    // Obtener solo las fechas que tienen dos reservas
    const bookedDates = Object.keys(bookingCountByDate).filter(date => bookingCountByDate[date] >= 2);

    res.json(bookedDates); // Envía las fechas completamente reservadas como respuesta
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});







module.exports = router;
