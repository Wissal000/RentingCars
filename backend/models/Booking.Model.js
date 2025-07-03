import mongoose from "mongoose";

const BookingDetailsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: false, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    rentalStartDate: { type: Date, required: true },
    rentalEndDate: { type: Date, required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const BookingDetails = mongoose.model("BookingDetails", BookingDetailsSchema);

export default BookingDetails;
