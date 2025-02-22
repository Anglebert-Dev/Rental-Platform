const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "lala-properties",
      use_filename: true,
      unique_filename: false,
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};



module.exports = { uploadToCloudinary };
