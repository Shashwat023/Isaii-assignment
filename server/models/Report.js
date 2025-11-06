import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  overallScore: Number,
  percentile: Number,
  testsTaken: Number,
  averageScore: Number,
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  categoryScores: {
    aptitude: Number,
    coding: Number,
    hr: Number,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Report", reportSchema)
