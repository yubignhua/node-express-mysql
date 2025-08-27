const mongoose = require('mongoose');

const techStackItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'desktop', 'ai-ml', 'blockchain', 'other'],
    required: true
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  icon: String, // URL or icon class
  color: String // Hex color for UI theming
});

const demoConfigSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['iframe', 'interactive-component', 'code-sandbox', 'video', 'image-gallery'],
    required: true
  },
  url: String,
  embedCode: String,
  interactiveFeatures: [{
    name: String,
    description: String,
    action: String // JavaScript action or API endpoint
  }],
  screenshots: [String],
  videoUrl: String
});

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  condition: String, // Description of how to unlock
  points: {
    type: Number,
    default: 10
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
});

const metricsSchema = new mongoose.Schema({
  githubStars: {
    type: Number,
    default: 0
  },
  githubForks: {
    type: Number,
    default: 0
  },
  githubWatchers: {
    type: Number,
    default: 0
  },
  commits: {
    type: Number,
    default: 0
  },
  contributors: {
    type: Number,
    default: 1
  },
  linesOfCode: {
    type: Number,
    default: 0
  },
  lastCommitDate: Date,
  deploymentStatus: {
    type: String,
    enum: ['deployed', 'staging', 'development', 'archived'],
    default: 'development'
  },
  uptime: {
    type: Number, // percentage
    default: 100
  },
  performanceScore: {
    type: Number, // 0-100
    default: 85
  }
});

const projectShowcaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  techStack: [techStackItemSchema],
  category: {
    type: String,
    enum: ['web-app', 'mobile-app', 'desktop-app', 'api', 'library', 'tool', 'game', 'ai-ml', 'blockchain', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'in-development', 'completed', 'maintained', 'archived'],
    default: 'completed'
  },
  githubUrl: String,
  liveUrl: String,
  demoUrl: String,
  documentationUrl: String,
  
  // Island position for the adventure map
  islandPosition: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    theme: {
      type: String,
      enum: ['tropical', 'arctic', 'volcanic', 'mystical', 'tech'],
      default: 'tropical'
    }
  },
  
  demoConfig: demoConfigSchema,
  achievements: [achievementSchema],
  
  // Project metrics and statistics
  metrics: {
    type: metricsSchema,
    default: () => ({})
  },
  
  // Development timeline
  timeline: [{
    phase: String,
    description: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed', 'delayed'],
      default: 'planned'
    }
  }],
  
  // Challenges and solutions
  challenges: [{
    problem: String,
    solution: String,
    technicalDetails: String,
    lessonsLearned: String
  }],
  
  // Features list
  features: [{
    name: String,
    description: String,
    implemented: {
      type: Boolean,
      default: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],
  
  // SEO and metadata
  seoMetadata: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String
  },
  
  // Display settings
  displaySettings: {
    featured: {
      type: Boolean,
      default: false
    },
    showInPortfolio: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    backgroundColor: String,
    textColor: String,
    accentColor: String
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    interactions: {
      type: Number,
      default: 0
    },
    demoLaunches: {
      type: Number,
      default: 0
    },
    githubClicks: {
      type: Number,
      default: 0
    },
    liveUrlClicks: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
projectShowcaseSchema.index({ slug: 1 });
projectShowcaseSchema.index({ category: 1 });
projectShowcaseSchema.index({ status: 1 });
projectShowcaseSchema.index({ 'displaySettings.featured': 1 });
projectShowcaseSchema.index({ 'displaySettings.sortOrder': 1 });

// Virtual for project URL
projectShowcaseSchema.virtual('url').get(function() {
  return `/projects/${this.slug}`;
});

// Virtual for completion percentage
projectShowcaseSchema.virtual('completionPercentage').get(function() {
  if (!this.features || this.features.length === 0) return 100;
  const implementedFeatures = this.features.filter(f => f.implemented).length;
  return Math.round((implementedFeatures / this.features.length) * 100);
});

// Pre-save middleware
projectShowcaseSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 200);
  }
  
  next();
});

// Static methods
projectShowcaseSchema.statics.findFeatured = function() {
  return this.find({ 'displaySettings.featured': true, 'displaySettings.showInPortfolio': true })
    .sort({ 'displaySettings.sortOrder': 1 });
};

projectShowcaseSchema.statics.findByCategory = function(category) {
  return this.find({ category, 'displaySettings.showInPortfolio': true })
    .sort({ 'displaySettings.sortOrder': 1 });
};

projectShowcaseSchema.statics.findByTech = function(techName) {
  return this.find({ 
    'techStack.name': { $regex: techName, $options: 'i' },
    'displaySettings.showInPortfolio': true 
  });
};

// Instance methods
projectShowcaseSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

projectShowcaseSchema.methods.incrementInteractions = function() {
  this.analytics.interactions += 1;
  return this.save();
};

projectShowcaseSchema.methods.trackAction = function(action) {
  const actionMap = {
    'demo-launch': 'demoLaunches',
    'github-click': 'githubClicks',
    'live-url-click': 'liveUrlClicks'
  };
  
  if (actionMap[action]) {
    this.analytics[actionMap[action]] += 1;
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Check if model already exists to prevent OverwriteModelError
module.exports = mongoose.models.ProjectShowcase || mongoose.model('ProjectShowcase', projectShowcaseSchema);