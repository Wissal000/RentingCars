import express from "express";
import BookModel from "../models/Booking.Model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Add a new Booking
router.post("/", async (req, res) => {
  try {
    const BookingData = req.body;

    const newBooking = new BookModel(BookingData);
    await newBooking.save();

    res
      .status(201)
      .json({ message: "Booking created successfully", customer: newBooking });
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
      .populate("carId") // populate the car document linked by carId
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

// POST /booking/:id
router.post("/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;


    // Fetch the booking by ID
    const booking = await BookModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ✅ UPDATE STATUS
    booking.status = status;
    await booking.save(); // ✅ Save it to the DB

    // SETUP EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_KEY, // App password
      },
    });

    const mailOptions = {
      from: {
        address: process.env.GOOGLE_USER,
        name: "Rentizo",
      },
      to: booking.email,
      subject: "📢 Your Car Rental Booking Status Has Been Updated",
      text: `Hi ${booking.firstName},

Your booking status is now: ${status.toUpperCase()}.

Thank you for choosing Rentizo!`,
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2b6cb0;">Hello ${booking.firstName},</h2>
      <p>We wanted to inform you that your car rental booking status has been updated.</p>
      <p>
        <strong>Status:</strong> 
        <span style="color: ${
          status === "confirmed"
            ? "#3182ce"
            : status === "cancelled"
            ? "#e53e3e"
            : status === "completed"
            ? "#38a169"
            : "#d69e2e"
        };">${status.toUpperCase()}</span>
      </p>

      <hr style="margin: 20px 0;" />

      <h3>Your Booking Summary</h3>
      <ul>
        <li><strong>Full Name:</strong> ${booking.firstName} ${
        booking.lastName
      }</li>
        <li><strong>Rental Period:</strong> ${new Date(
          booking.rentalStartDate
        ).toLocaleDateString()} - ${new Date(
        booking.rentalEndDate
      ).toLocaleDateString()}</li>
      </ul>

        <em>This is an automated message, please do not reply.</em>
      </p>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Status updated and email sent" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to update status or send email" });
  }
});

export default router;
