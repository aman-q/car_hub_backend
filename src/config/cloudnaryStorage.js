import cloudinary from './cloudinaryConfig.js';

export const uploadMultipleImagesToCloudinary = async (files, folderName) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error('Missing or invalid files array');
  }

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName, // Specify the Cloudinary folder
          public_id: file.originalname.split('.')[0], // Filename without extension
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error(`Error uploading file ${file.originalname}:`, error);
            return reject(new Error(`Error uploading file ${file.originalname}: ${error.message}`));
          }
          resolve(result.secure_url); // Return the secure URL of the uploaded image
        }
      );

      // Pipe the file buffer to the upload stream
      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else {
        reject(new Error(`File buffer missing for ${file.originalname}`));
      }
    });
  });

  try {
    const urls = await Promise.all(uploadPromises);
    return urls; // Array of uploaded image URLs
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error(`Error uploading images: ${error.message}`);
  }
};
