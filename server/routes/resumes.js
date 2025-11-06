import express from "express"
import Resume from "../models/Resume.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
    res.json(resumes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const resume = new Resume({ ...req.body, userId: req.userId })
    await resume.save()
    res.json(resume)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true })
    res.json(resume)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    res.json({ message: "Resume deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
