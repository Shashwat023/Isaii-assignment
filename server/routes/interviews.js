import express from "express"
import Interview from "../models/Interview.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId })
    res.json(interviews)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const interview = new Interview({ ...req.body, userId: req.userId })
    await interview.save()
    res.json(interview)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, {
      new: true,
    })
    res.json(interview)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Interview.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    res.json({ message: "Interview deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
