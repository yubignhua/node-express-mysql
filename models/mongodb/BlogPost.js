const mongoose = require('mongoose');

const codeExampleSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'html', 'css', 'sql', 'bash', 'json']
  },
  code: {
    type: String,
    required: true
  },
  title: String,
  description: String,
  executable: {
    type: Boolean,
    default: false
  },
  expectedOutput: String
});

const challengeSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'code-completion', 'true-false', 'short-answer'],
    default: 'multiple-choice'
  },
  options: [String], // For multiple choice questions
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: String,
  points: {
    type: Number,
    default: 10
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const interactionStatsSchema = new mongoose.Schema({
  codeExecutions: {
    type: Number,
    default: 0
  },
  challengeAttempts: {
    type: Number,
    default: 0
  },
  challengeSuccesses: {
    type: Number,
    default: 0
  },
  averageReadTime: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  }
});

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  author: {
    type: String,
    default: 'Portfolio Owner'
  },
  codeExamples: [codeExampleSchema],
  challenge: challengeSchema,
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['tutorial', 'project-showcase', 'thoughts', 'technical-deep-dive', 'career'],
    default: 'tutorial'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  estimatedReadTime: {
    type: Number, // in minutes
    default: 5
  },
  featuredImage: String,
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  viewCount: {
    type: Number,
    default: 0
  },
  interactionStats: {
    type: interactionStatsSchema,
    default: () => ({})
  },
  seoMetadata: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ isPublished: 1, publishedAt: -1 });

// Virtual for URL
blogPostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Virtual for reading time calculation
blogPostSchema.virtual('calculatedReadTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Pre-save middleware
blogPostSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.estimatedReadTime) {
    this.estimatedReadTime = this.calculatedReadTime;
  }
  
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Static methods
blogPostSchema.statics.findPublished = function() {
  return this.find({ isPublished: true }).sort({ publishedAt: -1 });
};

blogPostSchema.statics.findByTag = function(tag) {
  return this.find({ tags: tag, isPublished: true }).sort({ publishedAt: -1 });
};

blogPostSchema.statics.findByCategory = function(category) {
  return this.find({ category, isPublished: true }).sort({ publishedAt: -1 });
};

// Instance methods
blogPostSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

blogPostSchema.methods.updateInteractionStats = function(statType, increment = 1) {
  if (this.interactionStats[statType] !== undefined) {
    this.interactionStats[statType] += increment;
    return this.save();
  }
  return Promise.resolve(this);
};

// Check if model already exists to prevent OverwriteModelError
module.exports = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);