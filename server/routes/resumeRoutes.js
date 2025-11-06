import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import {
  uploadResume,
  getResumeSuggestions,
  getAtsScore,
  getKeywordAnalysis,
  getActionVerbs,
} from '../controllers/resumeController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// @desc    Upload a resume
// @route   POST /api/resumes/upload
// @access  Private
router.post('/upload', protect, upload.single('resume'), uploadResume);

// @desc    Get resume suggestions
// @route   GET /api/resumes/:id/suggestions
// @access  Private
router.get('/:id/suggestions', protect, getResumeSuggestions);

// @desc    Get ATS score for a resume
// @route   GET /api/resumes/:id/ats-score
// @access  Private
router.get('/:id/ats-score', protect, getAtsScore);

// @desc    Get keyword analysis for a resume
// @route   POST /api/resumes/:id/keywords
// @access  Private
router.post('/:id/keywords', protect, getKeywordAnalysis);

// @desc    Get action verbs suggestions
// @route   GET /api/resumes/:id/action-verbs
// @access  Private
router.get('/:id/action-verbs', protect, getActionVerbs);

export default router;
