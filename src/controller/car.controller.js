import mongoose from 'mongoose';
import Car from '../modles/cars.model.js';
import {uploadMultipleImagesToCloudflare} from '../config/cloudflareStorage.js'


export const getallcars = async (req,res)=>{
    try{
        const cars= await Car.find().populate('addedby','fname lname email');
        if(cars.length===0){
          return res.status(404).json({message:"No cars found", cars:[]});
        }
        res.status(200).json({mesaage:'Cars retrieved successfully',cars});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error",error:err.message});
    }
}
export const addcar = async(req,res)=>{
  try {
    const id=req.user;
    const { title, description, yearOfManufacture, driveType, company } = req.body;

    const tags = {
      car_type: req.body['tags.car_type'],
    };

    // Check if files are uploaded
    if (!req.files || req.files.length < 3) {
      return res.status(400).json({ message: 'At least 3 images are required.' });
    }

    // Debug uploaded files
    console.log('Uploaded files:', req.files);

    // Upload files to Cloudflare
    const photoUrls = await uploadMultipleImagesToCloudflare(req.files, 'collection/');

    // Create new Car entry
    const newCar = new Car({
      addedby:id,
      title,
      description,
      images: photoUrls,
      tags,
      yearOfManufacture: parseInt(yearOfManufacture, 10),
      company,
      driveType,
    });

    await newCar.save();

    return res.status(201).json({
      message: 'Car added successfully!',
      car: newCar,
    });
  } catch (err) {
    console.error('Error adding car:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const removecar = async(req,res)=>{
    try{
        const id = req.params.id;
        if ( !id ||!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Missing or Invalid  ID' });
        }
        const car = await Car.findByIdAndDelete(id);
        if (!car) {
          return res.status(404).json({ message: 'Car not found' });
        }
        return res.status(200).json({ message: 'Car deleted successfully', car });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

export const updateCar = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid or missing Car ID' });
    }
    const { title, description, tags, yearOfManufacture, company, driveType } = req.body;
    let updatedImages = [];
    if (req.files?.images?.length > 0) {
      try {
        updatedImages = await Promise.all(
          req.files.images.map((file) => uploadMultipleImagesToCloudflare(file, 'collection/'))
        );
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        return res.status(500).json({ message: 'Error uploading images', error: uploadError.message });
      }
    }

   
    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(tags && { tags }), 
      ...(yearOfManufacture && { yearOfManufacture: parseInt(yearOfManufacture, 10) }),
      ...(company && { company }),
      ...(driveType && { driveType }),
      ...(updatedImages.length > 0 && { images: updatedImages }),
    };
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      lean: true,
    });

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

   
    return res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
  } catch (err) {
    console.error('Error updating car:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const usercar = async(req,res)=>{
    try{
        const id= req.user;
        const usercar= await Car.find({addedby:id}).populate('addedby','fname lname email');
        if(usercar.length ===0){
            return res.status(404).json({ message: 'No cars found for this user', cars:[]});
        }
        return res.status(200).json({message:'User Cars', usercar});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const singlecardeatil = async(req,res)=>{
  try{
    const id= req.params.id;

    const cardeatil= await Car.findById(id).populate('addedby','fname lname email');
    if(!cardeatil){
      return res.status(404).json({ message: 'Car not found', car: {} });
    }
    return res.status(200).json({message:'Car Details', cardeatil});

  }
  catch(err){
    console.log(err);
    return res.status(500).json({message:'Server Error', error:err.message});
  }
}

