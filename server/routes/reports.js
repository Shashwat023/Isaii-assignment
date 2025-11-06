import express from "express"
import Report from "../models/Report.js"
import Test from "../models/Test.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    let report = await Report.findOne({ userId: req.userId })

    if (!report) {
      const completedTests = await Test.find({ userId: req.userId, status: "completed" })
      const scores = completedTests.map((t) => t.score || 0)
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0
      const percentile = Math.min(100, Math.round((avgScore / 100) * 100))

      report = new Report({
        userId: req.userId,
        overallScore: Math.max(...scores, 0),
        percentile,
        testsTaken: completedTests.length,
        averageScore: avgScore,
        strengths: ["Quick problem solving", "Strong fundamentals"],
        weaknesses: ["System design", "Advanced algorithms"],
        recommendations: ["Practice system design problems", "Review advanced data structures"],
        categoryScores: {
          aptitude: 75,
          coding: 68,
          hr: 85,
        },
      })
      await report.save()
    }

    res.json(report)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
