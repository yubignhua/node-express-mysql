const redis = require('redis');

class SessionManager {
  constructor() {
    this.redisClient = null;
    this.isRedisConnected = false;
    this.initRedis();
  }

  async initRedis() {
    try {
      this.redisClient = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.log('Redis connection refused, using fallback mode');
            return false; // Stop retrying
          }
          if (options.total_retry_time > 1000 * 30) { // Reduced retry time
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 3) { // Reduced retry attempts
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.redisClient.on('connect', () => {
        console.log('Redis client connected');
        this.isRedisConnected = true;
      });

      this.redisClient.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
          console.log('Redis server not available, running in fallback mode');
        } else {
          console.log('Redis client error:', err.message);
        }
        this.isRedisConnected = false;
      });

      this.redisClient.on('end', () => {
        console.log('Redis client disconnected');
        this.isRedisConnected = false;
      });

      await this.redisClient.connect();
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.isRedisConnected = false;
    }
  }

  async setSession(sessionId, sessionData, ttl = 3600) {
    if (!this.isRedisConnected) {
      console.warn('Redis not connected, session not stored');
      return false;
    }

    try {
      const key = `session:${sessionId}`;
      await this.redisClient.setEx(key, ttl, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error setting session:', error);
      return false;
    }
  }

  async getSession(sessionId) {
    if (!this.isRedisConnected) {
      return null;
    }

    try {
      const key = `session:${sessionId}`;
      const sessionData = await this.redisClient.get(key);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async updateSession(sessionId, updates, ttl = 3600) {
    if (!this.isRedisConnected) {
      return false;
    }

    try {
      const existingSession = await this.getSession(sessionId);
      if (existingSession) {
        const updatedSession = { ...existingSession, ...updates };
        return await this.setSession(sessionId, updatedSession, ttl);
      }
      return false;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  }

  async deleteSession(sessionId) {
    if (!this.isRedisConnected) {
      return false;
    }

    try {
      const key = `session:${sessionId}`;
      await this.redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  async setCache(key, value, ttl = 300) {
    if (!this.isRedisConnected) {
      return false;
    }

    try {
      await this.redisClient.setEx(`cache:${key}`, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting cache:', error);
      return false;
    }
  }

  async getCache(key) {
    if (!this.isRedisConnected) {
      return null;
    }

    try {
      const cachedData = await this.redisClient.get(`cache:${key}`);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  async deleteCache(key) {
    if (!this.isRedisConnected) {
      return false;
    }

    try {
      await this.redisClient.del(`cache:${key}`);
      return true;
    } catch (error) {
      console.error('Error deleting cache:', error);
      return false;
    }
  }

  async getUserSessions(userId) {
    if (!this.isRedisConnected) {
      return [];
    }

    try {
      const keys = await this.redisClient.keys(`session:*`);
      const sessions = [];
      
      for (const key of keys) {
        const sessionData = await this.redisClient.get(key);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.userId === userId) {
            sessions.push({
              sessionId: key.replace('session:', ''),
              ...parsed
            });
          }
        }
      }
      
      return sessions;
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  async getActiveSessionsCount() {
    if (!this.isRedisConnected) {
      return 0;
    }

    try {
      const keys = await this.redisClient.keys('session:*');
      return keys.length;
    } catch (error) {
      console.error('Error getting active sessions count:', error);
      return 0;
    }
  }

  async cleanupExpiredSessions() {
    // Redis handles TTL automatically, but we can add custom cleanup logic here
    console.log('Session cleanup completed (handled by Redis TTL)');
  }

  async disconnect() {
    if (this.redisClient && this.isRedisConnected) {
      await this.redisClient.disconnect();
      this.isRedisConnected = false;
    }
  }
}

module.exports = new SessionManager();