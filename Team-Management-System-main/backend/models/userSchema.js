import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      isEmail: true,
      match: [/\S+@\S+\.\S+/, "Please fill valif email address"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      isLength: {
        options: { min: 8 },
        errorMessage: "Password should be at least 8 chars",
      },
      minLength: 6,
    },
    role: { type: String, enum: ["Admin", "Member"], default: "Member" },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team", max: 5 }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
