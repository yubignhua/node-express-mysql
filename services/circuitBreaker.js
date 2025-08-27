class CircuitBreaker {
  constructor(options = {}) {
    this.name = options.name || 'Circuit Breaker';
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.timeout = options.timeout || 10000; // 10 seconds
    this.monitoringPeriod = options.monitoringPeriod || 10000; // 10 seconds
    
    // Circuit breaker states
    this.states = {
      CLOSED: 'CLOSED',     // Normal operation
      OPEN: 'OPEN',         // Circuit is open, requests fail fast
      HALF_OPEN: 'HALF_OPEN' // Testing if service is back
    };
    
    this.state = this.states.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttempt = Date.now();
    
    // Statistics
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      timeouts: 0,
      circuitOpenCount: 0
    };
    
    // Event listeners
    this.listeners = {
      open: [],
      halfOpen: [],
      close: []
    };
  }

  async execute(operation) {
    this.stats.totalRequests++;
    
    // Check if circuit is open
    if (this.state === this.states.OPEN) {
      if (Date.now() < this.nextAttempt) {
        const error = new Error(`Circuit breaker is OPEN for ${this.name}`);
        error.circuitBreakerOpen = true;
        throw error;
      } else {
        // Try to half-open the circuit
        this.state = this.states.HALF_OPEN;
        this.emit('halfOpen');
      }
    }
    
    try {
      // Execute the operation with timeout
      const result = await this.executeWithTimeout(operation);
      
      // Operation succeeded
      this.onSuccess();
      return result;
    } catch (error) {
      // Operation failed
      this.onFailure(error);
      throw error;
    }
  }

  async executeWithTimeout(operation) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.stats.timeouts++;
        reject(new Error(`Operation timed out after ${this.timeout}ms`));
      }, this.timeout);

      Promise.resolve(operation())
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  onSuccess() {
    this.stats.successfulRequests++;
    this.failureCount = 0;
    
    if (this.state === this.states.HALF_OPEN) {
      // Service is back, close the circuit
      this.state = this.states.CLOSED;
      this.emit('close');
    }
  }

  onFailure(error) {
    this.stats.failedRequests++;
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.openCircuit();
    }
  }

  openCircuit() {
    this.state = this.states.OPEN;
    this.nextAttempt = Date.now() + this.resetTimeout;
    this.stats.circuitOpenCount++;
    this.emit('open');
  }

  // Event system
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in circuit breaker event listener for ${event}:`, error);
        }
      });
    }
    
    // Log state changes
    console.log(`Circuit Breaker [${this.name}] state changed to: ${this.state.toUpperCase()}`);
  }

  // Getters for monitoring
  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttempt: this.nextAttempt,
      stats: { ...this.stats },
      isOpen: this.state === this.states.OPEN,
      isHalfOpen: this.state === this.states.HALF_OPEN,
      isClosed: this.state === this.states.CLOSED
    };
  }

  getStats() {
    const successRate = this.stats.totalRequests > 0 
      ? (this.stats.successfulRequests / this.stats.totalRequests) * 100 
      : 0;
    
    return {
      ...this.stats,
      successRate: Math.round(successRate * 100) / 100,
      failureRate: Math.round((100 - successRate) * 100) / 100,
      currentState: this.state
    };
  }

  // Manual controls
  forceOpen() {
    this.state = this.states.OPEN;
    this.nextAttempt = Date.now() + this.resetTimeout;
    this.emit('open');
  }

  forceClose() {
    this.state = this.states.CLOSED;
    this.failureCount = 0;
    this.emit('close');
  }

  reset() {
    this.state = this.states.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttempt = Date.now();
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      timeouts: 0,
      circuitOpenCount: 0
    };
  }
}

module.exports = CircuitBreaker;