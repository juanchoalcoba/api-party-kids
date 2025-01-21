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
  const { name, namekid, email, phone, date, hours, timeSlot } = req.body;

  // Paso 1: Verificar disponibilidad de las horas para la fecha solicitada
  const reservedBookings = await Booking.find({ date: new Date(date) });

  // Definir los bloques de tiempo a bloquear
  const blockedTimes = [];
  const timeSlotHour = parseInt(timeSlot.split(':')[0]); // Asumiendo que timeSlot tiene formato 'HH:MM'

  if (hours === 4) {
    // Bloqueamos 4 horas para adelante y 4 horas para atrás
    for (let i = -4; i <= 4; i++) {
      blockedTimes.push(timeSlotHour + i);
    }
  } else if (hours === 8) {
    // Bloqueamos 8 horas para adelante y 4 horas para atrás
    for (let i = -4; i <= 8; i++) {
      blockedTimes.push(timeSlotHour + i);
    }
  }

  // Verificar si alguno de los horarios solicitados ya está reservado
  const isConflict = reservedBookings.some(booking => {
    const bookingHour = parseInt(booking.timeSlot.split(':')[0]);
    return blockedTimes.includes(bookingHour);
  });

  if (isConflict) {
    return res.status(400).json({ message: 'Horario no disponible.' });
  }

  // Paso 2: Crear la nueva reserva si no hay conflictos
  try {
    const newBooking = new Booking({ name, namekid, email, phone, date, hours, timeSlot });
    await newBooking.save();
    
    // Paso 3: Actualizar la disponibilidad de la fecha (puedes hacerlo en el frontend o también puedes agregar un campo 'isAvailable' en tu modelo de fecha)
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



module.exports = router;
