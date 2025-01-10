// server/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  
});

const Booking = mongoose.model('Booking', bookingSchema, 'party-kids');
module.exports = Booking;

