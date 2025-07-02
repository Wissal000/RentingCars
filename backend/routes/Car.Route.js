// carsRoute.js
import express from "express";
import multer from "multer";
import Car from "../models/Car.model.js";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

// POST /api/cars - Add new car with image upload
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      brand,
      pricePerDay,
      description,
      year,
      color,
      seats,
      fuelType,
      transmission,
    } = req.body;

    if (!name || !brand || !pricePerDay) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imageUrl = req.file?.path; // multer-storage-cloudinary sets the URL here
    const available = req.body.available === "true"; // ✅ convert string to boolean

    const newCar = new Car({
      name,
      brand,
      pricePerDay: String(pricePerDay),
      description,
      year: Number(year),
      color: String(color),
      seats: Number(seats),
      fuelType,
      transmission, // <-- include here
      image: imageUrl,
      available, //
    });

    const savedCar = await newCar.save();

    res
      .status(201)
      .json({ message: "Car created successfully", car: savedCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/cars - Fetch all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find({}); // Fetch all cars
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/cars/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ message: "Car deleted successfully", id: deletedCar._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete car", error: err });
  }
});

export default router;
