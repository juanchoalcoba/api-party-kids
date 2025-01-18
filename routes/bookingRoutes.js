'use strict'

const express = require('express');
const Booking = require('../models/Booking');
const mongoose = require("mongoose")
const router = express.Router();




const accountSid = 'ACb5810eecc32e7e99d1d7a07b342079fa'; 
const authToken = 'a6d9703048342862031dc490eab67b06';  

// Función para enviar el SMS



// Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// server/routes/bookingRoutes.js
router.post('/', async (req, res) => {
  const { name, namekid, email, phone, startTime, duration } = req.body;

  // Convertimos startTime a un objeto Date
  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60 * 60 * 1000); // Duración en horas

  // Verificamos si ya existe una reserva en ese rango de tiempo
  const existingBookings = await Booking.find({
    $or: [
      { 
        $and: [
          { startTime: { $lt: end } },  // Si la hora de inicio de la reserva actual es antes del final de la nueva reserva
          { endTime: { $gt: start } }  // Y si el final de la reserva actual es después del inicio de la nueva reserva
        ]
      }
    ]
  });

  // Si hay reservas existentes en ese rango, respondemos con un error
  if (existingBookings.length > 0) {
    return res.status(400).json({ message: 'La hora seleccionada ya está reservada, por favor elige otra.' });
  }

  // Ahora comprobamos si la reserva no tiene solapamiento, si pasa, creamos la nueva reserva
  try {
    const newBooking = new Booking({ 
      name, 
      namekid, 
      email, 
      phone, 
      startTime: start, 
      duration 
    });
    await newBooking.save();
    
    // Enviar mensaje de SMS (esto ya está implementado en tu código)
    await sendSms();

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




// NUEVO ENDPOINT: Obtener solo las fechas reservadas
// NUEVO ENDPOINT: Obtener solo las fechas reservadas
router.get('/booked-dates', async (req, res) => {
  try {
    const bookings = await Booking.find().select('startTime duration -_id'); 
    const bookedDates = bookings.map(booking => ({
      startTime: booking.startTime,
      endTime: new Date(booking.startTime.getTime() + booking.duration * 60 * 60 * 1000),  // Calculamos la hora de finalización
    }));
    res.json(bookedDates); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});






module.exports = router;
