// server/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  namekid: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  hours: { type: String, required: true },
  timeSlot: { type: String, required: true },
  archived: {type: String, default: false},
  confirmed: {type: Boolean, default: false},
  viewedByAdmin: {type: Boolean, default: false}
});

const Booking = mongoose.model('Booking', bookingSchema, 'party-kids');
module.exports = Booking;

