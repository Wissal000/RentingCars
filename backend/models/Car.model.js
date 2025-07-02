// models/Car.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. Clio 5
    brand: { type: String, required: true }, // e.g. Renault, Peugeot
    pricePerDay: { type: String, required: true }, // e.g. "300dh"
    description: { type: String },
    year: { type: Number }, // e.g. 2022
    color: {type: String, required: true},
    fuelType: {
      type: String,
      enum: ["essence", "diesel", "hybride", "électrique"],
    },
    transmission: {
      type: String,
      enum: ["manuelle", "automatique"],
      required:true
    },
    image: { type: String }, // Cloudinary image URL
    available: { type: Boolean},
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
