const express = require('express');
const githubService = require('../services/githubService');
const router = express.Router();

// GET /api/github/repositories/:username
router.get('/repositories/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const repositories = await githubService.getRepositories(username);

    res.json({
      success: true,
      data: repositories
    });
  } catch (error) {
    console.error('GitHub repositories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GitHub repositories'
    });
  }
});

// GET /api/github/profile/:username
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await githubService.getUserProfile(username);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'GitHub user not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('GitHub profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GitHub profile'
    });
  }
});

// GET /api/github/stats/:username/:repo
router.get('/stats/:username/:repo', async (req, res) => {
  try {
    const { username, repo } = req.params;
    
    const [commitActivity, languageStats] = await Promise.all([
      githubService.getCommitActivity(username, repo),
      githubService.getLanguageStats(username, repo)
    ]);

    res.json({
      success: true,
      data: {
        commitActivity,
        languageStats
      }
    });
  } catch (error) {
    console.error('GitHub stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GitHub statistics'
    });
  }
});

// GET /api/github/activity/:username
router.get('/activity/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Get recent repositories and calculate activity metrics
    const repositories = await githubService.getRepositories(username);
    
    const activityMetrics = {
      totalRepos: repositories.length,
      totalStars: repositories.reduce((sum, repo) => sum + repo.stars, 0),
      totalForks: repositories.reduce((sum, repo) => sum + repo.forks, 0),
      languages: [...new Set(repositories.map(repo => repo.language).filter(Boolean))],
      recentActivity: repositories
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map(repo => ({
          name: repo.name,
          updatedAt: repo.updatedAt,
          language: repo.language,
          stars: repo.stars
        }))
    };

    res.json({
      success: true,
      data: activityMetrics
    });
  } catch (error) {
    console.error('GitHub activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GitHub activity'
    });
  }
});

module.exports = router;