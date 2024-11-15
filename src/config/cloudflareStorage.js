import { S3Client, PutObjectCommand, DeleteObjectCommand  } from '@aws-sdk/client-s3';
import { accountId, accessKeyId, secretAccessKey, bucketName, endpointUrl, imagebaseurl } from './cloudflareConfig.credential.js';

// Initialize the S3 client with Cloudflare R2 configuration
const s3 = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto' for the region
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`, // Endpoint URL for Cloudflare R2
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  forcePathStyle: true,
});

// Function to upload a single image file to Cloudflare R2
export const uploadSingleImageToCloudflare = async (file, folderName) => {
  if (!file || !file.buffer) {
    throw new Error('Missing image file or file buffer');
  }

  const filePath = `${folderName}/${(file.originalname)}`; // The key for the object in the bucket

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName, 
      Key: filePath, 
      Body: file.buffer, 
      ContentType: file.mimetype, 
      ACL: 'public-read',
    });

    const response = await s3.send(command);

    const imageUrl = `${imagebaseurl}${filePath}`;
    return imageUrl;
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(`Error uploading image: ${error.message}`);
  }
};

// Function to upload multiple image files to Cloudflare R2
export const uploadMultipleImagesToCloudflare = async (files, folderName) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error('Missing or invalid files array');
  }
  const uploadPromises = files.map(async (file) => {
    if (!file || !file.buffer) {
      throw new Error('Missing image file or file buffer');
    }

    const filePath = `${folderName}${(file.originalname)}`; 

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', 
      });
      const response = await s3.send(command);
      const imageUrl = `${imagebaseurl}${filePath}`;
      return imageUrl;
    } catch (error) {
      console.error(`Error uploading file ${file.originalname}:`, error);
      throw new Error(`Error uploading file ${file.originalname}: ${error.message}`);
    }
  });
  try {
    const urls = await Promise.all(uploadPromises);
    return urls; 
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(`Error uploading images: ${error.message}`);
  }
};
