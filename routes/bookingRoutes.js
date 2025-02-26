'use strict'

const express = require('express');
const Booking = require('../models/Booking');
const mongoose = require("mongoose")
const router = express.Router();

const Resend = require('resend').Resend; // Para adaptarlo a require

// Inicializa Resend con tu API key
const resend = new Resend('re_ZbJ8vVLa_MDYoostNjcErLg9xvztPRdht');




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


     // Enviar el correo electrónico usando Resend
     await resend.emails.send({
      from: 'onboarding@resend.dev',   // Cambia este correo por el remitente adecuado
      to: 'kidspartypdlt@gmail.com',  
      subject: 'Se ha creado una reserva',
      html: `<h1>Hola Kids Party,</h1><p>Se ha realizado una reserva para el día ${date}, ${hours} horas a las ${timeSlot} hora inicial.</p>
      <p> Si deseas comunicarte el telefono es ${phone} y su nombre ${name}
      `
    });

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

// Ruta PUT para leer una reserva
router.patch('/', async (req, res) => {
  const { name } = req.query;  // Recibimos el 'name' desde los parámetros de la URL

  try {
    // Intentamos encontrar y actualizar la reserva que coincida con el 'name'
    const result = await Booking.updateOne(
      { name: name },
      { $set: { viewedByAdmin: true } } 
    );

    // Verificamos si no se encontró ningún documento
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada o ya leida' });
    }

    // Si la actualización fue exitosa
    res.status(200).json({ message: 'Reserva leida con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error leyendo la reserva', error });
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
