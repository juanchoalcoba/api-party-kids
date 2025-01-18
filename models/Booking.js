const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  namekid: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // Duración en horas, por ejemplo
  selectedTime: { type: String, required: true }, // Hora seleccionada, por ejemplo "14:00"
  confirmed: { type: Boolean, default: false }, // Valor predeterminado es false, es decir, no está confirmada
});

const Booking = mongoose.model('Booking', bookingSchema, 'party-kids');
module.exports = Booking;
