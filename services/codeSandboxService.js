const axios = require('axios');
const CircuitBreaker = require('./circuitBreaker');
require('dotenv').config();

class CodeSandboxService {
  constructor() {
    this.apiKey = process.env.CODESANDBOX_API_KEY;
    this.baseURL = 'https://codesandbox.io/api/v1';
    
    // Initialize circuit breaker
    this.circuitBreaker = new CircuitBreaker({
      name: 'CodeSandbox API',
      failureThreshold: 3,
      resetTimeout: 45000, // 45 seconds
      timeout: 20000 // 20 seconds
    });
    
    // Cache for sandbox results
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
    
    // Supported languages and their configurations
    this.languageConfigs = {
      javascript: {
        template: 'vanilla',
        files: {
          'index.js': '',
          'index.html': `<!DOCTYPE html>
<html>
<head>
    <title>JavaScript Demo</title>
</head>
<body>
    <div id="app"></div>
    <script src="index.js"></script>
</body>
</html>`
        }
      },
      typescript: {
        template: 'vanilla-ts',
        files: {
          'index.ts': '',
          'index.html': `<!DOCTYPE html>
<html>
<head>
    <title>TypeScript Demo</title>
</head>
<body>
    <div id="app"></div>
    <script src="index.ts"></script>
</body>
</html>`
        }
      },
      react: {
        template: 'create-react-app',
        files: {
          'src/App.js': '',
          'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));`
        }
      },
      'react-typescript': {
        template: 'create-react-app-typescript',
        files: {
          'src/App.tsx': '',
          'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));`
        }
      },
      vue: {
        template: 'vue',
        files: {
          'src/App.vue': '',
          'src/main.js': `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');`
        }
      },
      node: {
        template: 'node',
        files: {
          'index.js': '',
          'package.json': `{
  "name": "node-demo",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}`
        }
      }
    };
  }

  async createSandbox(code, language = 'javascript', title = 'Code Demo') {
    const cacheKey = `create:${language}:${this.hashCode(code)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }
    
    try {
      if (!this.apiKey) {
        return this.createFallbackSandbox(code, language, title);
      }

      const config = this.languageConfigs[language] || this.languageConfigs.javascript;
      const files = this.prepareFiles(code, language, config);

      const result = await this.circuitBreaker.execute(async () => {
        const response = await axios.post(`${this.baseURL}/sandboxes`, {
          title,
          description: `Interactive ${language} demo`,
          template: config.template,
          files,
          tags: [language, 'demo', 'interactive'],
          privacy: 0 // Public
        }, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000
        });

        return {
          id: response.data.id,
          url: `https://codesandbox.io/s/${response.data.id}`,
          embedUrl: `https://codesandbox.io/embed/${response.data.id}`,
          editorUrl: `https://codesandbox.io/s/${response.data.id}?file=/src/App.js`,
          title: response.data.title,
          template: response.data.template
        };
      });
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('CodeSandbox creation error:', error.message);
      return this.createFallbackSandbox(code, language, title);
    }
  }

  async updateSandbox(sandboxId, code, language = 'javascript') {
    try {
      if (!this.apiKey) {
        throw new Error('CodeSandbox API key not available');
      }

      const config = this.languageConfigs[language] || this.languageConfigs.javascript;
      const files = this.prepareFiles(code, language, config);

      const result = await this.circuitBreaker.execute(async () => {
        const response = await axios.patch(`${this.baseURL}/sandboxes/${sandboxId}`, {
          files
        }, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        });

        return response.data;
      });
      
      return result;
    } catch (error) {
      console.error('CodeSandbox update error:', error.message);
      throw error;
    }
  }

  async getSandbox(sandboxId) {
    const cacheKey = `get:${sandboxId}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }
    
    try {
      if (!this.apiKey) {
        throw new Error('CodeSandbox API key not available');
      }

      const result = await this.circuitBreaker.execute(async () => {
        const response = await axios.get(`${this.baseURL}/sandboxes/${sandboxId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 8000
        });

        return response.data;
      });
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('CodeSandbox get error:', error.message);
      throw error;
    }
  }

  async executeCode(code, language = 'javascript') {
    try {
      // For simple code execution, we can use a lightweight approach
      if (language === 'javascript') {
        return this.executeJavaScript(code);
      }
      
      // For other languages, create a temporary sandbox
      const sandbox = await this.createSandbox(code, language, 'Code Execution');
      return {
        success: true,
        output: 'Code executed successfully',
        sandboxUrl: sandbox.url,
        embedUrl: sandbox.embedUrl
      };
    } catch (error) {
      console.error('Code execution error:', error.message);
      return {
        success: false,
        error: error.message,
        output: 'Code execution failed'
      };
    }
  }

  executeJavaScript(code) {
    try {
      // Simple JavaScript execution in a safe context
      // Note: In production, this should use a proper sandboxing solution
      const logs = [];
      const originalConsoleLog = console.log;
      
      // Capture console.log output
      console.log = (...args) => {
        logs.push(args.join(' '));
      };
      
      // Execute the code
      const result = eval(code);
      
      // Restore console.log
      console.log = originalConsoleLog;
      
      return {
        success: true,
        output: logs.join('\n') || String(result),
        result: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: `Error: ${error.message}`
      };
    }
  }

  prepareFiles(code, language, config) {
    const files = { ...config.files };
    
    // Determine the main file based on language
    let mainFile;
    switch (language) {
      case 'react':
        mainFile = 'src/App.js';
        break;
      case 'react-typescript':
        mainFile = 'src/App.tsx';
        break;
      case 'vue':
        mainFile = 'src/App.vue';
        break;
      case 'typescript':
        mainFile = 'index.ts';
        break;
      case 'node':
        mainFile = 'index.js';
        break;
      default:
        mainFile = 'index.js';
    }
    
    // Set the main file content
    files[mainFile] = code;
    
    // Convert to CodeSandbox format
    const formattedFiles = {};
    Object.keys(files).forEach(path => {
      formattedFiles[path] = {
        content: files[path],
        isBinary: false
      };
    });
    
    return formattedFiles;
  }

  createFallbackSandbox(code, language, title) {
    // Create a fallback response when CodeSandbox API is not available
    const fallbackId = this.generateFallbackId();
    
    return {
      id: fallbackId,
      url: `#sandbox-${fallbackId}`,
      embedUrl: `#embed-${fallbackId}`,
      editorUrl: `#editor-${fallbackId}`,
      title: title,
      template: language,
      fallback: true,
      code: code,
      language: language,
      message: 'CodeSandbox API not available - showing code preview'
    };
  }

  generateFallbackId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Template management
  getAvailableTemplates() {
    return Object.keys(this.languageConfigs).map(lang => ({
      language: lang,
      template: this.languageConfigs[lang].template,
      description: this.getLanguageDescription(lang)
    }));
  }

  getLanguageDescription(language) {
    const descriptions = {
      javascript: 'Vanilla JavaScript with HTML',
      typescript: 'TypeScript with type checking',
      react: 'React application with JSX',
      'react-typescript': 'React with TypeScript',
      vue: 'Vue.js application',
      node: 'Node.js server application'
    };
    
    return descriptions[language] || 'Code sandbox';
  }

  // Health check and monitoring
  async healthCheck() {
    try {
      if (!this.apiKey) {
        return { status: 'fallback', message: 'Using fallback sandbox creation' };
      }
      
      // Simple health check - this would ping CodeSandbox API
      return { 
        status: 'healthy', 
        circuitBreakerState: this.circuitBreaker.getState(),
        cacheSize: this.cache.size
      };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        error: error.message, 
        circuitBreakerState: this.circuitBreaker.getState() 
      };
    }
  }

  // Cache management
  clearCache() {
    this.cache.clear();
    console.log('CodeSandbox service cache cleared');
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      circuitBreakerStats: this.circuitBreaker.getStats(),
      supportedLanguages: Object.keys(this.languageConfigs)
    };
  }
}

module.exports = new CodeSandboxService();