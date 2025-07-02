import express from "express";
import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }    //createdAt/updatedAt
);

const userModel = mongoose.model("user", userSchema);

export default userModel;