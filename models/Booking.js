// server/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  namekid: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  hours: { type: String, required: true },
  timeSlot: { type: String, required: true },
  viewed: {type: Boolean, default: false, // El valor predeterminado es false, es decir, la reserva no está confirmada
  
  confirmed: {type: Boolean, default: false, // El valor predeterminado es false, es decir, la reserva no está confirmada
  }
});

const Booking = mongoose.model('Booking', bookingSchema, 'party-kids');
module.exports = Booking;

