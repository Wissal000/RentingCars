import express from "express";
import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String }, // For Google OAuth
    provider: { type: String, default: "local" }, // "local" or "google"
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
