// server/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  namekid: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: String, required: true },  // Nuevo campo para la duración (4 horas o 8 horas)
  selectedTime: { type: String, required: true },  // Nuevo campo para el horario seleccionado
  confirmed: { type: Boolean, default: false }  // El valor predeterminado es false, es decir, la reserva no está confirmada
});

const Booking = mongoose.model('Booking', bookingSchema, 'party-kids');
module.exports = Booking;
