// utils/cloudinaryUpload.js
const cloudinary = require('../config/cloudinaryConfig');

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer - The image file buffer
 * @param {Object} options - Optional Cloudinary upload options
 * @returns {Promise<Object>} - The uploaded result object
 */
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(options, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        }).end(buffer);
    });
};

module.exports = uploadToCloudinary;
