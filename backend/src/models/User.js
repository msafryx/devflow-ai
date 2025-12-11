import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  provider: { type: String, default: "google" },
  providerId: { type: String, required: true }, // Google "sub"
  name: String,
  email: { type: String, required: true },
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
