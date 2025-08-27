const axios = require('axios');
const CircuitBreaker = require('./circuitBreaker');
require('dotenv').config();

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
    this.headers = this.token ? {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
    } : {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    // Initialize circuit breaker for GitHub API
    this.circuitBreaker = new CircuitBreaker({
      name: 'GitHub API',
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      timeout: 10000 // 10 seconds
    });
    
    // Cache for API responses
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async makeRequest(url, params = {}) {
    const cacheKey = `${url}:${JSON.stringify(params)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }
    
    // Use circuit breaker for the request
    return this.circuitBreaker.execute(async () => {
      const response = await axios.get(url, {
        headers: this.headers,
        params,
        timeout: 8000
      });
      
      // Cache the response
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    });
  }

  async getRepositories(username) {
    try {
      const data = await this.makeRequest(`${this.baseURL}/users/${username}/repos`, {
        sort: 'updated',
        per_page: 50,
      });

      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        size: repo.size,
        defaultBranch: repo.default_branch,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        topics: repo.topics || [],
        isPrivate: repo.private,
        isFork: repo.fork,
        hasIssues: repo.has_issues,
        hasWiki: repo.has_wiki,
        hasPages: repo.has_pages,
        openIssuesCount: repo.open_issues_count,
        license: repo.license ? repo.license.name : null,
        visibility: repo.visibility
      }));
    } catch (error) {
      console.error('GitHub repositories error:', error.message);
      return this.getFallbackRepositories();
    }
  }

  getFallbackRepositories() {
    return [
      {
        id: 1,
        name: 'interactive-portfolio',
        description: 'Interactive portfolio website with 3D elements and real-time features',
        htmlUrl: '#',
        language: 'JavaScript',
        stars: 0,
        forks: 0,
        watchers: 0,
        topics: ['react', 'threejs', 'portfolio'],
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'ecommerce-platform',
        description: 'Full-stack e-commerce solution with modern features',
        htmlUrl: '#',
        language: 'TypeScript',
        stars: 0,
        forks: 0,
        watchers: 0,
        topics: ['nextjs', 'ecommerce', 'typescript'],
        updatedAt: new Date().toISOString()
      }
    ];
  }

  async getCommitActivity(username, repo) {
    try {
      const data = await this.makeRequest(`${this.baseURL}/repos/${username}/${repo}/stats/commit_activity`);
      return data || [];
    } catch (error) {
      console.error('GitHub commit activity error:', error.message);
      return this.getFallbackCommitActivity();
    }
  }

  async getLanguageStats(username, repo) {
    try {
      const data = await this.makeRequest(`${this.baseURL}/repos/${username}/${repo}/languages`);
      return data || {};
    } catch (error) {
      console.error('GitHub language stats error:', error.message);
      return this.getFallbackLanguageStats();
    }
  }

  async getUserProfile(username) {
    try {
      const data = await this.makeRequest(`${this.baseURL}/users/${username}`);
      
      return {
        login: data.login,
        name: data.name,
        bio: data.bio,
        company: data.company,
        location: data.location,
        email: data.email,
        blog: data.blog,
        twitterUsername: data.twitter_username,
        publicRepos: data.public_repos,
        publicGists: data.public_gists,
        followers: data.followers,
        following: data.following,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        avatarUrl: data.avatar_url,
        gravatarId: data.gravatar_id,
        hireable: data.hireable
      };
    } catch (error) {
      console.error('GitHub user profile error:', error.message);
      return this.getFallbackUserProfile();
    }
  }

  async getRepositoryContributors(username, repo) {
    try {
      const data = await this.makeRequest(`${this.baseURL}/repos/${username}/${repo}/contributors`);
      return data.map(contributor => ({
        login: contributor.login,
        contributions: contributor.contributions,
        avatarUrl: contributor.avatar_url,
        htmlUrl: contributor.html_url
      }));
    } catch (error) {
      console.error('GitHub contributors error:', error.message);
      return [];
    }
  }

  async getRepositoryReleases(username, repo) {
    try {
      const data = await this.makeRequest(`${this.baseURL}/repos/${username}/${repo}/releases`, {
        per_page: 10
      });
      return data.map(release => ({
        id: release.id,
        tagName: release.tag_name,
        name: release.name,
        body: release.body,
        publishedAt: release.published_at,
        htmlUrl: release.html_url,
        downloadCount: release.assets.reduce((sum, asset) => sum + asset.download_count, 0)
      }));
    } catch (error) {
      console.error('GitHub releases error:', error.message);
      return [];
    }
  }

  async getOverallStats(username) {
    try {
      const [profile, repos] = await Promise.all([
        this.getUserProfile(username),
        this.getRepositories(username)
      ]);

      const stats = {
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stars, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks, 0),
        languages: {},
        mostStarredRepo: repos.reduce((max, repo) => repo.stars > max.stars ? repo : max, repos[0] || {}),
        recentActivity: repos.slice(0, 5).map(repo => ({
          name: repo.name,
          updatedAt: repo.updatedAt,
          language: repo.language
        }))
      };

      // Calculate language distribution
      repos.forEach(repo => {
        if (repo.language) {
          stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
        }
      });

      return { profile, stats };
    } catch (error) {
      console.error('GitHub overall stats error:', error.message);
      return this.getFallbackOverallStats();
    }
  }

  getFallbackCommitActivity() {
    // Generate mock commit activity for the last 52 weeks
    return Array.from({ length: 52 }, (_, i) => ({
      week: Math.floor(Date.now() / 1000) - (51 - i) * 604800, // 604800 seconds in a week
      total: Math.floor(Math.random() * 20),
      days: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
    }));
  }

  getFallbackLanguageStats() {
    return {
      JavaScript: 45230,
      TypeScript: 32100,
      CSS: 12450,
      HTML: 8900,
      Python: 5600
    };
  }

  getFallbackUserProfile() {
    return {
      login: 'developer',
      name: 'Full Stack Developer',
      bio: 'Passionate about creating amazing web experiences',
      publicRepos: 25,
      followers: 100,
      following: 50,
      createdAt: '2020-01-01T00:00:00Z',
      location: 'Remote',
      company: 'Independent'
    };
  }

  getFallbackOverallStats() {
    return {
      profile: this.getFallbackUserProfile(),
      stats: {
        totalRepos: 25,
        totalStars: 150,
        totalForks: 45,
        languages: this.getFallbackLanguageStats(),
        mostStarredRepo: {
          name: 'interactive-portfolio',
          stars: 50,
          language: 'JavaScript'
        },
        recentActivity: [
          { name: 'interactive-portfolio', updatedAt: new Date().toISOString(), language: 'JavaScript' },
          { name: 'ecommerce-platform', updatedAt: new Date().toISOString(), language: 'TypeScript' }
        ]
      }
    };
  }

  // Health check method
  async healthCheck() {
    try {
      await this.makeRequest(`${this.baseURL}/rate_limit`);
      return { status: 'healthy', circuitBreakerState: this.circuitBreaker.getState() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, circuitBreakerState: this.circuitBreaker.getState() };
    }
  }

  // Clear cache method
  clearCache() {
    this.cache.clear();
    console.log('GitHub service cache cleared');
  }
}

module.exports = new GitHubService();