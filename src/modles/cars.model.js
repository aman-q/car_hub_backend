import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  addedby:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  tags: {
    car_type: {
      type: String,
      required: true,
    },
  },
  yearOfManufacture: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  driveType: {
    type: String,
    enum: ['LWD', 'RWD'],
    required: true,
  },
});

const Car = mongoose.model('Car', carSchema);
export default Car;
