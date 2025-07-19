import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  pickupLocation: {
    type: String,
  },
  dropoffLocation: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  price: {
    type: Number,
    required: true,
  },
  extras: {
    type: Object, // Optional: GPS, babySeat, etc.
    default: {},
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// 🔁 Static method to soft delete a booking
bookingSchema.statics.softDelete = async function (bookingId) {
  return this.findByIdAndUpdate(bookingId, { isDeleted: true });
};

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
