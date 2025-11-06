import mongoose from "mongoose"

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: String,
  role: String,
  date: Date,
  package: Number,
  status: { type: String, enum: ["upcoming", "completed", "rejected"], default: "upcoming" },
  topicsRequired: [String],
  pastQuestions: [
    {
      question: String,
      difficulty: String,
      category: String,
    },
  ],
  notes: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Interview", interviewSchema)
