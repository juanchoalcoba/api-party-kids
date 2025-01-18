// server/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  namekid: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  startTime: { type: Date, required: true },  // Hora de inicio
  duration: { type: Number, required: true },  // Duración en horas (4 o 8 horas)
  confirmed: { type: Boolean, default: false }
});

const Booking = mongoose.model('Booking', bookingSchema, 'party-kids');
module.exports = Booking;
