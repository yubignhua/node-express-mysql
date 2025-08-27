const githubService = require('./githubService');
const aiService = require('./aiService');
const codeSandboxService = require('./codeSandboxService');

class ServiceManager {
  constructor() {
    this.services = {
      github: githubService,
      ai: aiService,
      codeSandbox: codeSandboxService
    };
    
    // Service health monitoring
    this.healthCheckInterval = 5 * 60 * 1000; // 5 minutes
    this.healthStatus = new Map();
    
    // Start health monitoring
    this.startHealthMonitoring();
  }

  async startHealthMonitoring() {
    // Initial health check
    await this.checkAllServicesHealth();
    
    // Set up periodic health checks
    setInterval(async () => {
      await this.checkAllServicesHealth();
    }, this.healthCheckInterval);
    
    console.log('Service health monitoring started');
  }

  async checkAllServicesHealth() {
    const healthChecks = Object.keys(this.services).map(async (serviceName) => {
      try {
        const service = this.services[serviceName];
        const health = await service.healthCheck();
        
        this.healthStatus.set(serviceName, {
          ...health,
          lastChecked: new Date(),
          serviceName
        });
        
        return { serviceName, ...health };
      } catch (error) {
        const errorStatus = {
          status: 'error',
          error: error.message,
          lastChecked: new Date(),
          serviceName
        };
        
        this.healthStatus.set(serviceName, errorStatus);
        return errorStatus;
      }
    });
    
    const results = await Promise.all(healthChecks);
    
    // Log any unhealthy services
    results.forEach(result => {
      if (result.status !== 'healthy' && result.status !== 'fallback') {
        console.warn(`Service ${result.serviceName} is ${result.status}: ${result.error || 'Unknown error'}`);
      }
    });
    
    return results;
  }

  getServiceHealth(serviceName) {
    if (serviceName) {
      return this.healthStatus.get(serviceName) || { status: 'unknown', serviceName };
    }
    
    // Return all service health statuses
    const allHealth = {};
    this.healthStatus.forEach((health, name) => {
      allHealth[name] = health;
    });
    
    return allHealth;
  }

  getOverallHealth() {
    const services = Array.from(this.healthStatus.values());
    const totalServices = services.length;
    
    if (totalServices === 0) {
      return { status: 'unknown', message: 'No services monitored' };
    }
    
    const healthyServices = services.filter(s => s.status === 'healthy' || s.status === 'fallback').length;
    const unhealthyServices = services.filter(s => s.status === 'unhealthy' || s.status === 'error').length;
    
    let overallStatus;
    if (unhealthyServices === 0) {
      overallStatus = 'healthy';
    } else if (healthyServices > unhealthyServices) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'unhealthy';
    }
    
    return {
      status: overallStatus,
      totalServices,
      healthyServices,
      unhealthyServices,
      services: services.reduce((acc, service) => {
        acc[service.serviceName] = {
          status: service.status,
          lastChecked: service.lastChecked
        };
        return acc;
      }, {}),
      lastUpdated: new Date()
    };
  }

  // GitHub service methods
  async getGitHubRepositories(username) {
    try {
      return await this.services.github.getRepositories(username);
    } catch (error) {
      console.error('GitHub repositories error:', error.message);
      return [];
    }
  }

  async getGitHubStats(username) {
    try {
      return await this.services.github.getOverallStats(username);
    } catch (error) {
      console.error('GitHub stats error:', error.message);
      return null;
    }
  }

  // AI service methods
  async processAIChat(message, userId, conversationId) {
    try {
      return await this.services.ai.processChatMessage(message, userId, conversationId);
    } catch (error) {
      console.error('AI chat error:', error.message);
      return "I'm having trouble processing that right now. Please try again later!";
    }
  }

  async generateCodeSuggestion(context, language) {
    try {
      return await this.services.ai.generateCodeSuggestion(context, language);
    } catch (error) {
      console.error('Code suggestion error:', error.message);
      return `// Error generating suggestion for ${language}\nconsole.log("Please try again later");`;
    }
  }

  // CodeSandbox service methods
  async createCodeSandbox(code, language, title) {
    try {
      return await this.services.codeSandbox.createSandbox(code, language, title);
    } catch (error) {
      console.error('CodeSandbox creation error:', error.message);
      return this.services.codeSandbox.createFallbackSandbox(code, language, title);
    }
  }

  async executeCode(code, language) {
    try {
      return await this.services.codeSandbox.executeCode(code, language);
    } catch (error) {
      console.error('Code execution error:', error.message);
      return {
        success: false,
        error: error.message,
        output: 'Code execution failed'
      };
    }
  }

  // Batch operations
  async getPortfolioData(username) {
    try {
      const [githubStats, repositories] = await Promise.all([
        this.getGitHubStats(username),
        this.getGitHubRepositories(username)
      ]);
      
      return {
        github: {
          stats: githubStats,
          repositories: repositories.slice(0, 10) // Limit to top 10
        },
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Portfolio data error:', error.message);
      return {
        github: {
          stats: null,
          repositories: []
        },
        error: error.message,
        generatedAt: new Date()
      };
    }
  }

  // Cache management
  clearAllCaches() {
    Object.values(this.services).forEach(service => {
      if (typeof service.clearCache === 'function') {
        service.clearCache();
      }
    });
    console.log('All service caches cleared');
  }

  getCacheStats() {
    const stats = {};
    Object.keys(this.services).forEach(serviceName => {
      const service = this.services[serviceName];
      if (typeof service.getCacheStats === 'function') {
        stats[serviceName] = service.getCacheStats();
      }
    });
    return stats;
  }

  // Service configuration
  getServiceConfiguration() {
    return {
      github: {
        hasToken: !!process.env.GITHUB_TOKEN,
        baseURL: 'https://api.github.com'
      },
      ai: {
        hasApiKey: !!process.env.XAI_API_KEY,
        baseURL: 'https://api.x.ai/v1'
      },
      codeSandbox: {
        hasApiKey: !!process.env.CODESANDBOX_API_KEY,
        baseURL: 'https://codesandbox.io/api/v1'
      }
    };
  }

  // Emergency methods
  async emergencyFallback() {
    console.log('Activating emergency fallback mode for all services');
    
    // Force all circuit breakers to use fallback responses
    Object.values(this.services).forEach(service => {
      if (service.circuitBreaker && typeof service.circuitBreaker.forceOpen === 'function') {
        service.circuitBreaker.forceOpen();
      }
    });
    
    return {
      status: 'fallback_activated',
      message: 'All services switched to fallback mode',
      timestamp: new Date()
    };
  }

  async recoverServices() {
    console.log('Attempting to recover all services');
    
    // Reset all circuit breakers
    Object.values(this.services).forEach(service => {
      if (service.circuitBreaker && typeof service.circuitBreaker.reset === 'function') {
        service.circuitBreaker.reset();
      }
    });
    
    // Clear all caches
    this.clearAllCaches();
    
    // Perform health check
    const healthResults = await this.checkAllServicesHealth();
    
    return {
      status: 'recovery_attempted',
      healthResults,
      timestamp: new Date()
    };
  }
}

module.exports = new ServiceManager();