import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import '../config/cloudinary.config'; // Import to initialize Cloudinary config

@Injectable()
export class UploadService {
  /**
   * Upload image from Fastify multipart file object
   * Used in upload controller
   */
 

  /**
   * Upload image from buffer
   * Used for files parsed by ParseMultipartFormInterceptor or direct buffer uploads
   */
  async uploadImage(file: any, filename: string, folder: string) {
    const buffer = await file.buffer;
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: filename.split('.')[0], // Use filename without extension as public_id
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed: No result returned'));
          resolve(result.secure_url);
        }
      );

      // Write buffer to the stream
      uploadStream.end(buffer);
    });
  }
}
