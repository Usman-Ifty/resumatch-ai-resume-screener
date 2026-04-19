const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema(
  {
    resumeText: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    verdict: {
      type: String,
      enum: ['Strong Match', 'Good Match', 'Partial Match', 'Weak Match'],
      required: true,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    coverLetter: {
      type: String,
      default: '',
    },
    roadmap: {
      type: [String],
      default: [],
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    atsFeedback: {
      type: String,
      default: '',
    },
    reasoning: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', AnalysisSchema);
