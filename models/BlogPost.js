const mongoose = require('mongoose');

const codeExampleSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: String,
});

const challengeSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  hint: String,
});

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  codeExamples: [codeExampleSchema],
  challenge: challengeSchema,
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  viewCount: {
    type: Number,
    default: 0,
  },
  interactionStats: {
    codeExecutions: {
      type: Number,
      default: 0,
    },
    challengeAttempts: {
      type: Number,
      default: 0,
    },
    challengeSuccesses: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Index for better search performance
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ slug: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);