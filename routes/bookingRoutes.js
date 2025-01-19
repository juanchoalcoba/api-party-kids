'use strict'

const express = require('express');
const Booking = require('../models/Booking');
const mongoose = require("mongoose")
const router = express.Router();

const twilio = require('twilio');  // Aquí importamos Twilio



const accountSid = 'ACb5810eecc32e7e99d1d7a07b342079fa'; 
const authToken = 'a6d9703048342862031dc490eab67b06';  
const client = new twilio(accountSid, authToken);  // Creamos una instancia del cliente de Twilio

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

// Crear una nueva reserva
router.post('/', async (req, res) => {
  async function sendSms() {
    try {
      const message = await client.messages.create({
        to: '+59899928843',  // El número fijo al que deseas enviar el SMS
        from: '+15705308650',  // Tu número de Twilio
        body: 'Se ha realizado una nueva reserva en KidsParty!!',  // El mensaje que deseas enviar
      });
      console.log('Mensaje enviado:', message.sid);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }

  const { name, namekid, email, phone, date, hours, timeSlot } = req.body;

  try {
    const newBooking = new Booking({ name, namekid, email, phone, date, hours, timeSlot });
    await newBooking.save();


    await sendSms();

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/', async (req, res) => {
  const { phone } = req.query;  // Recibimos el 'name' desde los parámetros de la URL

  try {
    // Intentamos eliminar el documento que coincida con el 'name'
    const result = await Booking.deleteOne({ phone: phone });

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
