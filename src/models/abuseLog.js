import mongoose from "mongoose";

const abuseLogSchema = new mongoose.Schema({
  ip_address: { type: String },
  route: { type: String },
  method: { type: String },
  exceeded_limit: { type: Number },
  allowed_limit: { type: Number },
  window_sec: { type: Number },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("AbuseLog", abuseLogSchema);
