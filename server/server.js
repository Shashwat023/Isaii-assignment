import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import testRoutes from "./routes/tests.js"
import interviewRoutes from "./routes/interviews.js"
import resumeRoutes from "./routes/resumes.js"
import reportRoutes from "./routes/reports.js"
import authMiddleware from "./middleware/auth.js"

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/placementprep")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tests", authMiddleware, testRoutes)
app.use("/api/interviews", authMiddleware, interviewRoutes)
app.use("/api/resumes", authMiddleware, resumeRoutes)
app.use("/api/reports", authMiddleware, reportRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "OK" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
