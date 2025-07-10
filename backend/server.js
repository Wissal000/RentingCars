import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/User.Route.js";
import carRoute from "./routes/Car.Route.js";
import BookingRoute from "./routes/Booking.Route.js";
import { setupPassport } from './config/passport.js';
import passport from "passport";
import GoogleRoute from './routes/google.Route.js';


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

app.use(passport.initialize());
setupPassport(); // initialize passport strategies

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("connected to mongoDb"))
    .catch(() => console.err());
  console.log("Server listening on port 8080");
});


app.use("/api", userRoute);
app.use("/cars", carRoute);
app.use("/booking", BookingRoute);
app.use('/auth', GoogleRoute);


