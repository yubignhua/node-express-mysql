const mongoose = require('mongoose');

const achievementDefinitionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['exploration', 'interaction', 'learning', 'collaboration', 'completion', 'special'],
    required: true
  },
  icon: String,
  badgeColor: {
    type: String,
    default: '#4F46E5'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 10
  },
  requirements: {
    type: Map,
    of: mongoose.Schema.Types.Mixed // Flexible requirements structure
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  unlockMessage: String,
  prerequisites: [String] // Array of achievement IDs that must be unlocked first
});

const userProgressSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true
  },
  progress: {
    type: Map,
    of: mongoose.Schema.Types.Mixed // Track progress towards requirements
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: Date,
  currentStreak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  }
});

const userAchievementSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: String, // For anonymous users
  
  // User profile information
  profile: {
    displayName: String,
    avatar: String,
    level: {
      type: Number,
      default: 1
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    experiencePoints: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: 'Visitor'
    }
  },
  
  // Achievement progress tracking
  achievements: [userProgressSchema],
  
  // Activity statistics
  statistics: {
    totalVisits: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    sectionsVisited: [{
      section: String,
      visitCount: {
        type: Number,
        default: 1
      },
      totalTime: {
        type: Number,
        default: 0
      },
      lastVisit: {
        type: Date,
        default: Date.now
      }
    }],
    skillInteractions: {
      type: Number,
      default: 0
    },
    projectsExplored: {
      type: Number,
      default: 0
    },
    blogPostsRead: {
      type: Number,
      default: 0
    },
    challengesCompleted: {
      type: Number,
      default: 0
    },
    codeExecutions: {
      type: Number,
      default: 0
    },
    collaborativeSessions: {
      type: Number,
      default: 0
    },
    chatMessages: {
      type: Number,
      default: 0
    }
  },
  
  // Preferences and settings
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    animationsEnabled: {
      type: Boolean,
      default: true
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  
  // Streaks and milestones
  streaks: {
    currentVisitStreak: {
      type: Number,
      default: 0
    },
    longestVisitStreak: {
      type: Number,
      default: 0
    },
    lastVisitDate: Date,
    currentLearningStreak: {
      type: Number,
      default: 0
    },
    longestLearningStreak: {
      type: Number,
      default: 0
    }
  },
  
  // Milestones reached
  milestones: [{
    type: {
      type: String,
      enum: ['points', 'level', 'achievements', 'time-spent', 'interactions'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    reachedAt: {
      type: Date,
      default: Date.now
    },
    celebrated: {
      type: Boolean,
      default: false
    }
  }],
  
  // Recent activity log
  recentActivity: [{
    type: {
      type: String,
      enum: ['achievement-unlock', 'section-visit', 'skill-interaction', 'project-explore', 'blog-read', 'challenge-complete', 'code-execute', 'chat-message'],
      required: true
    },
    description: String,
    points: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }],
  
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userAchievementSchema.index({ userId: 1 });
userAchievementSchema.index({ sessionId: 1 });
userAchievementSchema.index({ 'profile.totalPoints': -1 });
userAchievementSchema.index({ 'profile.level': -1 });
userAchievementSchema.index({ lastActive: -1 });

// Virtual for next level requirements
userAchievementSchema.virtual('nextLevelRequirement').get(function() {
  const baseXP = 100;
  const multiplier = 1.5;
  return Math.floor(baseXP * Math.pow(multiplier, this.profile.level));
});

// Virtual for level progress percentage
userAchievementSchema.virtual('levelProgress').get(function() {
  const currentLevelXP = this.profile.level > 1 ? 
    Math.floor(100 * Math.pow(1.5, this.profile.level - 2)) : 0;
  const nextLevelXP = this.nextLevelRequirement;
  const progressXP = this.profile.experiencePoints - currentLevelXP;
  const requiredXP = nextLevelXP - currentLevelXP;
  
  return Math.min(100, Math.max(0, (progressXP / requiredXP) * 100));
});

// Pre-save middleware for level calculation
userAchievementSchema.pre('save', function(next) {
  // Calculate level based on experience points
  const baseXP = 100;
  const multiplier = 1.5;
  let level = 1;
  let requiredXP = baseXP;
  
  while (this.profile.experiencePoints >= requiredXP) {
    level++;
    requiredXP = Math.floor(baseXP * Math.pow(multiplier, level - 1));
  }
  
  // Check if level increased
  if (level > this.profile.level) {
    this.profile.level = level;
    
    // Add milestone for level up
    this.milestones.push({
      type: 'level',
      value: level,
      reachedAt: new Date(),
      celebrated: false
    });
    
    // Add to recent activity
    this.recentActivity.unshift({
      type: 'achievement-unlock',
      description: `Reached level ${level}!`,
      points: 50,
      timestamp: new Date(),
      metadata: new Map([['level', level]])
    });
    
    // Update title based on level
    if (level >= 10) this.profile.title = 'Expert Explorer';
    else if (level >= 7) this.profile.title = 'Advanced Learner';
    else if (level >= 5) this.profile.title = 'Skilled Navigator';
    else if (level >= 3) this.profile.title = 'Curious Visitor';
    else this.profile.title = 'New Explorer';
  }
  
  // Limit recent activity to last 50 items
  if (this.recentActivity.length > 50) {
    this.recentActivity = this.recentActivity.slice(0, 50);
  }
  
  next();
});

// Static methods
userAchievementSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

userAchievementSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({})
    .sort({ 'profile.totalPoints': -1 })
    .limit(limit)
    .select('userId profile.displayName profile.totalPoints profile.level profile.title');
};

userAchievementSchema.statics.getTopByCategory = function(category, limit = 5) {
  return this.aggregate([
    { $unwind: '$achievements' },
    { $match: { 'achievements.isUnlocked': true } },
    { $lookup: {
        from: 'achievementdefinitions',
        localField: 'achievements.achievementId',
        foreignField: 'id',
        as: 'achievementDef'
    }},
    { $match: { 'achievementDef.category': category } },
    { $group: {
        _id: '$userId',
        totalCategoryPoints: { $sum: '$achievementDef.points' },
        categoryAchievements: { $sum: 1 },
        profile: { $first: '$profile' }
    }},
    { $sort: { totalCategoryPoints: -1 } },
    { $limit: limit }
  ]);
};

// Instance methods
userAchievementSchema.methods.addExperience = function(points, description = '') {
  this.profile.experiencePoints += points;
  this.profile.totalPoints += points;
  
  if (description) {
    this.recentActivity.unshift({
      type: 'achievement-unlock',
      description,
      points,
      timestamp: new Date()
    });
  }
  
  return this.save();
};

userAchievementSchema.methods.unlockAchievement = function(achievementId, achievementData = {}) {
  const existingAchievement = this.achievements.find(a => a.achievementId === achievementId);
  
  if (existingAchievement && !existingAchievement.isUnlocked) {
    existingAchievement.isUnlocked = true;
    existingAchievement.unlockedAt = new Date();
    
    // Add experience points
    const points = achievementData.points || 10;
    this.addExperience(points, `Unlocked achievement: ${achievementData.name || achievementId}`);
    
    return this.save();
  } else if (!existingAchievement) {
    // Create new achievement progress
    this.achievements.push({
      achievementId,
      isUnlocked: true,
      unlockedAt: new Date(),
      progress: new Map()
    });
    
    const points = achievementData.points || 10;
    this.addExperience(points, `Unlocked achievement: ${achievementData.name || achievementId}`);
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

userAchievementSchema.methods.updateProgress = function(achievementId, progressData) {
  let achievement = this.achievements.find(a => a.achievementId === achievementId);
  
  if (!achievement) {
    achievement = {
      achievementId,
      progress: new Map(),
      isUnlocked: false
    };
    this.achievements.push(achievement);
  }
  
  // Update progress
  Object.keys(progressData).forEach(key => {
    achievement.progress.set(key, progressData[key]);
  });
  
  return this.save();
};

userAchievementSchema.methods.recordActivity = function(activityType, metadata = {}) {
  // Update statistics
  const statMap = {
    'section-visit': 'totalVisits',
    'skill-interaction': 'skillInteractions',
    'project-explore': 'projectsExplored',
    'blog-read': 'blogPostsRead',
    'challenge-complete': 'challengesCompleted',
    'code-execute': 'codeExecutions',
    'chat-message': 'chatMessages'
  };
  
  if (statMap[activityType]) {
    this.statistics[statMap[activityType]]++;
  }
  
  // Add to recent activity
  this.recentActivity.unshift({
    type: activityType,
    description: metadata.description || '',
    points: metadata.points || 0,
    timestamp: new Date(),
    metadata: new Map(Object.entries(metadata))
  });
  
  this.lastActive = new Date();
  
  return this.save();
};

// Check if models already exist to prevent OverwriteModelError
const AchievementDefinition = mongoose.models.AchievementDefinition || mongoose.model('AchievementDefinition', achievementDefinitionSchema);
const UserAchievement = mongoose.models.UserAchievement || mongoose.model('UserAchievement', userAchievementSchema);

module.exports = {
  UserAchievement,
  AchievementDefinition
};