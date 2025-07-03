import express from "express";
import BookModel from "../models/Booking.Model.js";

const router = express.Router();

// Add a new Booking
router.post("/", async (req, res) => {
  try {
    const BookingData = req.body;

    const newBooking = new BookModel(BookingData);
    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", customer: newBooking });
  } catch (error) {
    console.error("Error Booking:", error);
    res.status(500).json({ error: "Failed to Rent this car" });
  }
});

// Get Book info by ID
router.get("/:id", async (req, res) => {
  try {
    const BookId = req.params.id;
    const Book = await BookModel.findById(BookId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});


// GET all bookings with populated car info
router.get("/", async (req, res) => {
  try {
    const bookings = await BookModel.find()
      .populate("carId")  // populate the car document linked by carId
      .exec();

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Delete a booking by ID
router.delete("/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await BookModel.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully", deletedBooking });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});


export default router;
