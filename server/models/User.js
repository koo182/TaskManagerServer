import mongoose from "mongoose";

const usernameFormatRegex = /^[^!?."]*$/;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minLength: [3, "Name should be at least 3 characters long"],
    maxLength: [30, "Name should be less than 30 characters"],
    required: [true, "Name is required"],
    lowercase: true,
    validate: {
      validator: (value) => usernameFormatRegex.test(value),
      message: "Invalid username format",
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  icon: {
    type: String,
  },
});

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
