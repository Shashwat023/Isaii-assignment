import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['ats', 'verbs', 'star', 'general', 'keywords'],
  },
  suggestions: [{
    type: String,
    required: true,
  }],
  jobDescription: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const analysisSchema = new mongoose.Schema({
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  keywordMatches: [{
    keyword: String,
    count: Number,
    importance: {
      type: String,
      enum: ['high', 'medium', 'low'],
    },
  }],
  actionVerbs: [{
    verb: String,
    count: Number,
  }],
  lastAnalyzed: {
    type: Date,
    default: Date.now,
  },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    analysis: analysisSchema,
    suggestions: [suggestionSchema],
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying
resumeSchema.index({ user: 1, isActive: 1 });
resumeSchema.index({ 'analysis.lastAnalyzed': -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
