import express from "express"
import Test from "../models/Test.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.userId })
    res.json(tests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const test = new Test({ ...req.body, userId: req.userId })
    await test.save()
    res.json(test)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findOne({ _id: req.params.id, userId: req.userId })
    res.json(test)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const test = await Test.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true })
    res.json(test)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Test.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    res.json({ message: "Test deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
