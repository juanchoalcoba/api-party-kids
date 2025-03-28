'use strict'

const express = require('express');
const Booking = require('../models/Booking');
const mongoose = require("mongoose")
const router = express.Router();


// Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 }); // Orden descendente por fecha
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una nueva reserva
router.post('/', async (req, res) => {
  

  const { name, namekid, phone, date, hours, timeSlot } = req.body;

  try {
    const newBooking = new Booking({ name, namekid, phone, date, hours, timeSlot });
    await newBooking.save();


   

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

// Ruta PATCH para marcar una reserva como vista usando _id
router.patch('/:id', async (req, res) => {
  const { id } = req.params; // Recibimos el _id en los parámetros de la solicitud

  try {
    const result = await Booking.findByIdAndUpdate(
      id,
      { $set: { viewedByAdmin: true } },
      { new: true } // Para devolver el documento actualizado
    );

    if (!result) {
      return res.status(404).json({ message: 'Reserva no encontrada o ya leída' });
    }

    res.status(200).json({ message: 'Reserva marcada como leída', booking: result });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando la reserva', error });
  }
});



// Ruta PATCH para marcar una reserva como vista usando _id
router.put('/archived/:id', async (req, res) => {
  const { id } = req.params; // Recibimos el _id en los parámetros de la solicitud

  try {
    const result = await Booking.findByIdAndUpdate(
      id,
      { $set: { archived: true, confirmed: false} },
      { new: true } // Para devolver el documento actualizado
    );

    if (!result) {
      return res.status(404).json({ message: 'Reserva no encontrada o ya leída' });
    }

    res.status(200).json({ message: 'Reserva marcada como leída', booking: result });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando la reserva', error });
  }
});










// NUEVO ENDPOINT: Obtener solo las fechas reservadas
/*
router.get('/booked-dates', async (req, res) => {
  try {
    const bookings = await Booking.find().select('date -_id'); // Selecciona solo las fechas sin el _id
    const bookedDates = bookings.map(booking => booking.date); // Extrae solo las fechas en un array
    res.json(bookedDates); // Envia las fechas reservadas como respuesta
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/





module.exports = router;
