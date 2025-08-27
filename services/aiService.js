const axios = require('axios');
const CircuitBreaker = require('./circuitBreaker');
require('dotenv').config();

class AIService {
  constructor() {
    this.xaiApiKey = process.env.XAI_API_KEY;
    this.baseURL = 'https://api.x.ai/v1'; // Placeholder URL - update when xAI API is available
    
    // Initialize circuit breaker for AI API
    this.circuitBreaker = new CircuitBreaker({
      name: 'xAI API',
      failureThreshold: 3,
      resetTimeout: 30000, // 30 seconds
      timeout: 15000 // 15 seconds
    });
    
    // Conversation context storage
    this.conversationContexts = new Map();
    this.maxContextLength = 10; // Keep last 10 messages
    
    // Response cache for common queries
    this.responseCache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  async generateCodeSuggestion(context, language = 'javascript') {
    const cacheKey = `code:${language}:${context}`;
    
    // Check cache first
    if (this.responseCache.has(cacheKey)) {
      const cached = this.responseCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.responseCache.delete(cacheKey);
    }
    
    try {
      if (!this.xaiApiKey) {
        return this.getFallbackCodeSuggestion(context, language);
      }

      // Use circuit breaker for AI API call
      const result = await this.circuitBreaker.execute(async () => {
        const response = await axios.post(`${this.baseURL}/completions`, {
          prompt: this.buildCodePrompt(context, language),
          max_tokens: 200,
          temperature: 0.7,
          stop: ['\n\n', '```']
        }, {
          headers: {
            'Authorization': `Bearer ${this.xaiApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 12000
        });

        return response.data.choices[0].text.trim();
      });
      
      // Cache the result
      this.responseCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('AI code suggestion error:', error.message);
      return this.getFallbackCodeSuggestion(context, language);
    }
  }

  buildCodePrompt(context, language) {
    return `Generate a ${language} code snippet for: ${context}

Requirements:
- Write clean, readable code
- Include comments where helpful
- Follow best practices for ${language}
- Keep it concise but functional

Code:`;
  }

  async processChatMessage(message, userId = 'anonymous', conversationId = null) {
    try {
      if (!this.xaiApiKey) {
        return this.getFallbackChatResponse(message, userId);
      }

      // Get or create conversation context
      const contextKey = conversationId || userId;
      let context = this.conversationContexts.get(contextKey) || [];
      
      // Add user message to context
      context.push({ role: 'user', content: message, timestamp: Date.now() });
      
      // Limit context length
      if (context.length > this.maxContextLength) {
        context = context.slice(-this.maxContextLength);
      }
      
      // Build messages for API
      const messages = [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        ...context.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      // Use circuit breaker for AI API call
      const response = await this.circuitBreaker.execute(async () => {
        const apiResponse = await axios.post(`${this.baseURL}/chat/completions`, {
          messages,
          max_tokens: 250,
          temperature: 0.8,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        }, {
          headers: {
            'Authorization': `Bearer ${this.xaiApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 12000
        });

        return apiResponse.data.choices[0].message.content;
      });
      
      // Add AI response to context
      context.push({ role: 'assistant', content: response, timestamp: Date.now() });
      this.conversationContexts.set(contextKey, context);
      
      return response;
    } catch (error) {
      console.error('AI chat processing error:', error.message);
      return this.getFallbackChatResponse(message, userId);
    }
  }

  getSystemPrompt() {
    return `You are an AI assistant representing a passionate full-stack developer's interactive portfolio. Your personality should be:

- Enthusiastic about technology and web development
- Knowledgeable about React, Node.js, TypeScript, and modern web technologies
- Friendly and approachable, but professional
- Eager to discuss projects, technical challenges, and solutions
- Able to explain complex concepts in simple terms
- Encouraging visitors to explore the interactive features of the portfolio

Key topics you should be ready to discuss:
- Frontend technologies (React, Three.js, animations)
- Backend development (Node.js, APIs, databases)
- Real-time features (WebSockets, collaboration)
- 3D web experiences and interactive design
- Full-stack project architecture
- Career journey and learning experiences

Keep responses conversational, engaging, and focused on the developer's expertise and projects. If asked about specific projects, encourage users to explore the interactive demos.`;
  }

  getFallbackCodeSuggestion(context, language = 'javascript') {
    const suggestions = {
      javascript: {
        'react': `const [state, setState] = useState(initialValue);
// Update state with new value
const handleChange = (newValue) => {
  setState(newValue);
};`,
        'node': `app.get('/api/endpoint', (req, res) => {
  try {
    // Process request
    const result = processData(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`,
        'async': `const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};`,
        'array': `const result = array
  .filter(item => item.active)
  .map(item => ({
    id: item.id,
    name: item.name,
    value: item.value
  }));`,
        'default': `// Example JavaScript code
const greeting = (name) => {
  return \`Hello, \${name}! Welcome to the interactive portfolio.\`;
};

console.log(greeting('Developer'));`
      },
      typescript: {
        'interface': `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}`,
        'component': `interface Props {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Component: React.FC<Props> = ({ title, children, onClick }) => {
  return (
    <div className="component" onClick={onClick}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};`,
        'default': `// TypeScript example
type Status = 'loading' | 'success' | 'error';

interface State {
  status: Status;
  data: any;
  error?: string;
}`
      },
      python: {
        'class': `class DataProcessor:
    def __init__(self, data):
        self.data = data
    
    def process(self):
        """Process the data and return results"""
        return [item for item in self.data if item.is_valid()]`,
        'function': `def calculate_average(numbers):
    """Calculate the average of a list of numbers"""
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)`,
        'default': `# Python example
def greet(name):
    return f"Hello, {name}! Welcome to the portfolio."

print(greet("Developer"))`
      }
    };

    const langSuggestions = suggestions[language] || suggestions.javascript;
    const contextLower = context.toLowerCase();
    
    for (const [key, suggestion] of Object.entries(langSuggestions)) {
      if (contextLower.includes(key)) {
        return suggestion;
      }
    }

    return langSuggestions.default || langSuggestions[Object.keys(langSuggestions)[0]];
  }

  getFallbackChatResponse(message, userId = 'anonymous') {
    const messageLower = message.toLowerCase();
    const responses = [];
    
    // Greeting responses
    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
      responses.push(
        "Hello! Welcome to my interactive portfolio! 👋 I'm excited to share my passion for full-stack development with you.",
        "Hi there! Thanks for visiting my portfolio. I love discussing technology and building amazing web experiences. What interests you most?",
        "Hey! Great to meet you! This portfolio showcases my journey as a full-stack developer. Feel free to ask me anything about my projects or technologies I work with."
      );
    }
    
    // Technology-specific responses
    else if (messageLower.includes('react') || messageLower.includes('frontend')) {
      responses.push(
        "React is absolutely amazing! 🚀 I love how it makes building interactive UIs so intuitive. Have you seen the 3D globe on the homepage? That's React Three Fiber in action!",
        "Frontend development with React is my passion! The component-based architecture makes complex applications manageable. Are you interested in learning about React hooks or state management?",
        "I'm a huge React enthusiast! From simple components to complex 3D interactions, React handles it all beautifully. What aspect of React development interests you most?"
      );
    }
    
    else if (messageLower.includes('node') || messageLower.includes('backend') || messageLower.includes('api')) {
      responses.push(
        "Node.js powers the backend of this portfolio! 💪 I love how JavaScript runs everywhere - from browsers to servers. The real-time features here use Socket.IO with Express.",
        "Backend development with Node.js is incredibly versatile! I've built APIs, real-time applications, and microservices. Want to know about the WebSocket implementation here?",
        "Node.js makes full-stack JavaScript development seamless! This portfolio's backend handles everything from API endpoints to real-time collaboration features."
      );
    }
    
    else if (messageLower.includes('3d') || messageLower.includes('three') || messageLower.includes('webgl')) {
      responses.push(
        "3D web experiences are the future! 🌍 The interactive globe you see uses React Three Fiber and WebGL. It's amazing how we can create immersive experiences right in the browser.",
        "I'm fascinated by 3D web development! Three.js opens up incredible possibilities for interactive storytelling. Have you tried rotating the skill globe on the homepage?",
        "WebGL and Three.js have revolutionized web experiences! Creating 3D interactions that run smoothly across devices is both challenging and rewarding."
      );
    }
    
    else if (messageLower.includes('project') || messageLower.includes('work') || messageLower.includes('portfolio')) {
      responses.push(
        "I'd love to tell you about my projects! 🚀 Each one represents a different challenge and learning experience. The adventure map section showcases them as interactive islands - pretty cool, right?",
        "My projects span from e-commerce platforms to real-time chat applications! Each one taught me something new about full-stack development. Which type of project interests you most?",
        "Every project in my portfolio tells a story of problem-solving and innovation! From 3D interactions to AI integration, I love pushing the boundaries of web development."
      );
    }
    
    else if (messageLower.includes('socket') || messageLower.includes('realtime') || messageLower.includes('websocket')) {
      responses.push(
        "Real-time features make applications come alive! ⚡ This portfolio uses Socket.IO for live collaboration, real-time particle updates, and instant messaging. It's like magic!",
        "WebSockets enable incredible user experiences! The collaborative code editor and live chat features here demonstrate the power of real-time communication.",
        "I'm passionate about real-time web applications! Socket.IO makes it possible to create engaging, interactive experiences where users can collaborate instantly."
      );
    }
    
    else if (messageLower.includes('database') || messageLower.includes('mongodb') || messageLower.includes('mysql')) {
      responses.push(
        "Data architecture is crucial for scalable applications! 📊 This portfolio uses MySQL for structured data, MongoDB for flexible content, and Redis for caching and sessions.",
        "I work with multiple database technologies! Each has its strengths - SQL for relationships, NoSQL for flexibility, and Redis for speed. It's all about choosing the right tool!",
        "Database design is an art! From relational models to document stores, I enjoy optimizing data flow and ensuring applications scale beautifully."
      );
    }
    
    else if (messageLower.includes('ai') || messageLower.includes('artificial intelligence') || messageLower.includes('machine learning')) {
      responses.push(
        "AI integration in web applications is incredibly exciting! 🤖 I'm exploring how AI can enhance user experiences, from code suggestions to intelligent chatbots like this one!",
        "The future of web development includes AI! I'm fascinated by how we can make applications smarter and more responsive to user needs through machine learning.",
        "AI-powered features can transform user experiences! From automated code generation to intelligent recommendations, the possibilities are endless."
      );
    }
    
    else if (messageLower.includes('career') || messageLower.includes('journey') || messageLower.includes('experience')) {
      responses.push(
        "My development journey has been incredible! 🌟 From learning my first HTML tag to building complex 3D web applications, every day brings new challenges and discoveries.",
        "The tech industry moves fast, and I love keeping up! Continuous learning is key - whether it's a new framework, design pattern, or emerging technology.",
        "My career path led me through various technologies and projects! Each experience shaped my approach to problem-solving and building user-centered applications."
      );
    }
    
    else if (messageLower.includes('learn') || messageLower.includes('advice') || messageLower.includes('tips')) {
      responses.push(
        "Learning never stops in tech! 📚 My advice: build projects, experiment with new technologies, and don't be afraid to break things. That's how we grow!",
        "The best way to learn is by doing! Start with small projects, gradually increase complexity, and always focus on solving real problems. Practice makes perfect!",
        "Stay curious and keep building! 🔨 The web development landscape evolves rapidly, but the fundamentals of problem-solving and user-focused design remain constant."
      );
    }
    
    // Default responses
    else {
      responses.push(
        "That's a fascinating topic! 💭 I love discussing technology and development. Feel free to explore the interactive features of this portfolio to see my work in action!",
        "Great question! 🤔 I'm always excited to chat about web development, projects, or any tech-related topics. What aspect interests you most?",
        "I appreciate your curiosity! 🌟 This portfolio is designed to be interactive - try clicking around, exploring the 3D elements, or checking out the project demos!",
        "Technology is amazing, isn't it? ⚡ I'm passionate about creating engaging web experiences. Is there a particular technology or project you'd like to know more about?"
      );
    }
    
    // Return a random response from the appropriate category
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Conversation management methods
  clearConversation(userId) {
    this.conversationContexts.delete(userId);
  }

  getConversationHistory(userId) {
    return this.conversationContexts.get(userId) || [];
  }

  // Health check and monitoring
  async healthCheck() {
    try {
      if (!this.xaiApiKey) {
        return { status: 'fallback', message: 'Using fallback responses' };
      }
      
      // Test with a simple request
      await this.circuitBreaker.execute(async () => {
        // This would be a simple health check to the AI API
        return Promise.resolve('healthy');
      });
      
      return { 
        status: 'healthy', 
        circuitBreakerState: this.circuitBreaker.getState(),
        activeConversations: this.conversationContexts.size
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
    this.responseCache.clear();
    console.log('AI service cache cleared');
  }

  getCacheStats() {
    return {
      cacheSize: this.responseCache.size,
      activeConversations: this.conversationContexts.size,
      circuitBreakerStats: this.circuitBreaker.getStats()
    };
  }
}

module.exports = new AIService();