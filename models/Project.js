const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: [{
    type: String,
    required: true,
  }],
  githubUrl: {
    type: String,
    required: true,
  },
  demoUrl: String,
  islandPosition: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  interactiveDemoConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  githubStats: {
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    lastUpdated: Date,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

projectSchema.index({ featured: -1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);