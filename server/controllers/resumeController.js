import asyncHandler from 'express-async-handler';
import Resume from '../models/resumeModel.js';
import { extractTextFromFile } from '../utils/fileParser.js';
import { analyzeResume } from '../services/resumeAnalysisService.js';

// @desc    Upload a resume
// @route   POST /api/resumes/upload
// @access  Private
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const { originalname, path, mimetype } = req.file;
  
  try {
    // Extract text from the uploaded file
    const content = await extractTextFromFile(path, mimetype);
    
    // Create new resume document
    const resume = await Resume.create({
      user: req.user._id,
      fileName: originalname,
      filePath: path,
      mimeType: mimetype,
      content,
    });

    // Initial analysis
    const analysis = await analyzeResume(content);
    
    // Update resume with initial analysis
    resume.analysis = analysis;
    await resume.save();

    res.status(201).json({
      _id: resume._id,
      fileName: resume.fileName,
      content: resume.content,
      analysis: resume.analysis,
      createdAt: resume.createdAt,
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500);
    throw new Error('Error processing resume');
  }
});

// @desc    Get resume suggestions
// @route   GET /api/resumes/:id/suggestions
// @access  Private
export const getResumeSuggestions = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  // Get suggestions based on the analysis type
  const { type = 'general', jobDescription = '' } = req.query;
  
  try {
    const suggestions = await generateSuggestions(resume.content, type, jobDescription);
    
    // Save suggestions to the resume
    if (!resume.suggestions) {
      resume.suggestions = [];
    }
    
    const newSuggestion = {
      type,
      suggestions,
      jobDescription: jobDescription || undefined,
      createdAt: new Date(),
    };
    
    resume.suggestions.push(newSuggestion);
    await resume.save();

    res.json({
      success: true,
      suggestions: newSuggestion.suggestions,
      type,
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500);
    throw new Error('Error generating suggestions');
  }
});

// @desc    Get ATS score for a resume
// @route   GET /api/resumes/:id/ats-score
// @access  Private
export const getAtsScore = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  try {
    const score = await calculateAtsScore(resume.content);
    
    // Update resume with ATS score
    resume.atsScore = score;
    await resume.save();

    res.json({
      success: true,
      score,
    });
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    res.status(500);
    throw new Error('Error calculating ATS score');
  }
});

// @desc    Get keyword analysis for a resume
// @route   POST /api/resumes/:id/keywords
// @access  Private
export const getKeywordAnalysis = asyncHandler(async (req, res) => {
  const { jobDescription = '' } = req.body;
  
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  try {
    const analysis = await analyzeKeywords(resume.content, jobDescription);
    
    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Error performing keyword analysis:', error);
    res.status(500);
    throw new Error('Error performing keyword analysis');
  }
});

// @desc    Get action verbs suggestions
// @route   GET /api/resumes/:id/action-verbs
// @access  Private
export const getActionVerbs = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  try {
    const suggestions = await suggestActionVerbs(resume.content);
    
    res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('Error generating action verb suggestions:', error);
    res.status(500);
    throw new Error('Error generating action verb suggestions');
  }
});

// Helper functions
async function generateSuggestions(content, type, jobDescription = '') {
  // This would typically call an AI service or use NLP to generate suggestions
  // For now, we'll return mock data
  
  const suggestions = {
    ats: [
      'Add more relevant skills from the job description',
      'Include measurable achievements with numbers',
      'Ensure consistent formatting throughout the document',
    ],
    verbs: [
      'Replace "worked on" with more specific action verbs like "developed", "implemented", or "designed"',
      'Use more powerful verbs like "orchestrated", "spearheaded", or "optimized"',
      'Start bullet points with action verbs in past tense for past roles',
    ],
    star: [
      'Add more STAR method examples to your experience section',
      'For each achievement, include the Situation, Task, Action, and Result',
      'Quantify your achievements with specific numbers and metrics',
    ],
    general: [
      'Keep your resume to one page if you have less than 10 years of experience',
      'Use bullet points instead of paragraphs for better readability',
      'Include relevant keywords from the job description',
    ],
  };

  return suggestions[type] || suggestions.general;
}

async function calculateAtsScore(content) {
  // This would typically analyze the resume against ATS requirements
  // For now, return a mock score between 70-95
  return Math.floor(Math.random() * 25) + 70;
}

async function analyzeKeywords(resumeText, jobDescription) {
  // This would analyze keywords in the resume vs job description
  // For now, return mock data
  const commonKeywords = ['JavaScript', 'React', 'Node.js', 'Problem Solving'];
  const missingKeywords = ['TypeScript', 'Redux', 'AWS'];
  
  return {
    commonKeywords,
    missingKeywords,
    matchPercentage: Math.floor(Math.random() * 30) + 50, // 50-80%
  };
}

async function suggestActionVerbs(resumeText) {
  // This would analyze the resume for weak verbs and suggest stronger alternatives
  // For now, return mock data
  return [
    { original: 'did', suggestion: 'implemented', count: 3 },
    { original: 'made', suggestion: 'developed', count: 2 },
    { original: 'helped', suggestion: 'collaborated on', count: 1 },
  ];
}
