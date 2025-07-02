// cloudinaryConfig.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "dl5rhomb8",
  api_key: "192265778812965",
  api_secret: "uEGzDbvpt1EsZBUbTULMm1E-QHE",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "car-images", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

export { cloudinary, storage };
