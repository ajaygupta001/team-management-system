import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: { type: String, enum: ["Admin", "Member"], default: "Member" },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Team = mongoose.model("Team", teamSchema);
export default Team;
