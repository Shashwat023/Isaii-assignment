import mongoose from "mongoose"

const testSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["aptitude", "coding", "hr"], required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  title: String,
  questions: [
    {
      id: String,
      question: String,
      options: [String],
      correctAnswer: String,
      category: String,
    },
  ],
  answers: [
    {
      questionId: String,
      selectedAnswer: String,
      flagged: Boolean,
    },
  ],
  startTime: Date,
  endTime: Date,
  score: Number,
  totalQuestions: Number,
  status: { type: String, enum: ["in-progress", "completed", "paused"], default: "in-progress" },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Test", testSchema)
