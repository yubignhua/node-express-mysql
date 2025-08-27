const mongoose = require('mongoose');
const BlogPost = require('../models/mongodb/BlogPost');
const ProjectShowcase = require('../models/mongodb/ProjectShowcase');
const { AchievementDefinition } = require('../models/mongodb/UserAchievement');

const seedBlogPosts = async () => {
  try {
    // Clear existing blog posts
    await BlogPost.deleteMany({});
    
    const blogPosts = [
      {
        title: "Building Interactive 3D Experiences with React Three Fiber",
        slug: "building-interactive-3d-experiences-react-three-fiber",
        content: `
# Building Interactive 3D Experiences with React Three Fiber

React Three Fiber has revolutionized how we create 3D experiences in React applications. In this post, we'll explore how to build engaging 3D interfaces that respond to user interactions.

## Getting Started

First, let's set up our basic 3D scene:

\`\`\`jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}
\`\`\`

## Adding Interactivity

The real magic happens when we add user interactions...
        `,
        excerpt: "Learn how to create stunning 3D experiences using React Three Fiber and modern web technologies.",
        codeExamples: [
          {
            language: 'javascript',
            code: `import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}`,
            title: "Basic 3D Scene Setup",
            description: "Setting up a basic 3D scene with React Three Fiber",
            executable: true
          }
        ],
        challenge: {
          question: "What is the primary benefit of using React Three Fiber over vanilla Three.js?",
          type: "multiple-choice",
          options: [
            "Better performance",
            "React component integration",
            "Smaller bundle size",
            "Built-in animations"
          ],
          correctAnswer: "React component integration",
          explanation: "React Three Fiber allows you to use Three.js within React's component system, making it easier to manage state and lifecycle.",
          points: 15,
          difficulty: "medium"
        },
        tags: ["react", "threejs", "3d", "frontend", "webgl"],
        category: "tutorial",
        difficulty: "intermediate",
        estimatedReadTime: 8,
        isPublished: true,
        publishedAt: new Date('2024-01-15')
      },
      {
        title: "Real-time Collaboration with Socket.IO and React",
        slug: "realtime-collaboration-socketio-react",
        content: `
# Real-time Collaboration with Socket.IO and React

Building real-time collaborative features is essential for modern web applications. Let's explore how to implement real-time collaboration using Socket.IO and React.

## Setting Up the Server

\`\`\`javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('code-change', (data) => {
    socket.broadcast.emit('code-update', data);
  });
});
\`\`\`

## Client-Side Integration

On the React side, we can use the socket connection to sync state...
        `,
        excerpt: "Implement real-time collaborative features using Socket.IO and React for seamless user experiences.",
        codeExamples: [
          {
            language: 'javascript',
            code: `const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('code-change', (data) => {
    socket.broadcast.emit('code-update', data);
  });
});`,
            title: "Socket.IO Server Setup",
            description: "Basic Socket.IO server configuration for real-time events",
            executable: false
          }
        ],
        challenge: {
          question: "Which Socket.IO method broadcasts to all connected clients except the sender?",
          type: "multiple-choice",
          options: [
            "socket.emit()",
            "socket.broadcast.emit()",
            "io.emit()",
            "socket.to().emit()"
          ],
          correctAnswer: "socket.broadcast.emit()",
          explanation: "socket.broadcast.emit() sends the event to all connected clients except the sender.",
          points: 10,
          difficulty: "easy"
        },
        tags: ["socketio", "realtime", "collaboration", "nodejs", "react"],
        category: "tutorial",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        isPublished: true,
        publishedAt: new Date('2024-01-10')
      },
      {
        title: "Advanced State Management with Zustand",
        slug: "advanced-state-management-zustand",
        content: `
# Advanced State Management with Zustand

Zustand provides a simple yet powerful solution for state management in React applications. Let's explore advanced patterns and best practices.

## Basic Store Setup

\`\`\`javascript
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
\`\`\`

## Advanced Patterns

For complex applications, we can implement middleware and persistence...
        `,
        excerpt: "Master advanced state management patterns using Zustand for scalable React applications.",
        codeExamples: [
          {
            language: 'javascript',
            code: `import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))`,
            title: "Basic Zustand Store",
            description: "Creating a simple counter store with Zustand",
            executable: true
          }
        ],
        tags: ["zustand", "state-management", "react", "javascript"],
        category: "tutorial",
        difficulty: "beginner",
        estimatedReadTime: 6,
        isPublished: true,
        publishedAt: new Date('2024-01-05')
      }
    ];
    
    await BlogPost.insertMany(blogPosts);
    console.log('Blog posts seeded successfully');
  } catch (error) {
    console.error('Error seeding blog posts:', error);
  }
};

const seedProjects = async () => {
  try {
    // Clear existing projects
    await ProjectShowcase.deleteMany({});
    
    const projects = [
      {
        name: "Interactive Portfolio Website",
        slug: "interactive-portfolio-website",
        description: "A cutting-edge portfolio website featuring 3D interactions, real-time collaboration, and gamified user experiences. Built with React Three Fiber, Socket.IO, and modern web technologies.",
        shortDescription: "3D interactive portfolio with real-time features and gamification",
        techStack: [
          { name: "React", category: "frontend", proficiency: "expert", color: "#61DAFB" },
          { name: "Three.js", category: "frontend", proficiency: "advanced", color: "#000000" },
          { name: "Node.js", category: "backend", proficiency: "expert", color: "#339933" },
          { name: "Socket.IO", category: "backend", proficiency: "advanced", color: "#010101" },
          { name: "MongoDB", category: "database", proficiency: "advanced", color: "#47A248" },
          { name: "Redis", category: "database", proficiency: "intermediate", color: "#DC382D" }
        ],
        category: "web-app",
        status: "in-development",
        githubUrl: "https://github.com/username/interactive-portfolio",
        liveUrl: "https://portfolio.example.com",
        islandPosition: {
          x: 50,
          y: 30,
          size: "large",
          theme: "tech"
        },
        demoConfig: {
          type: "interactive-component",
          interactiveFeatures: [
            {
              name: "3D Globe Interaction",
              description: "Drag to rotate the skill globe and click on skill points",
              action: "globe-interaction"
            },
            {
              name: "Real-time Collaboration",
              description: "Join collaborative coding sessions with other visitors",
              action: "collaboration-demo"
            }
          ]
        },
        achievements: [
          {
            id: "globe-master",
            name: "Globe Master",
            description: "Interact with all skill points on the 3D globe",
            icon: "🌍",
            condition: "Click on all skill points",
            points: 25,
            rarity: "rare"
          }
        ],
        features: [
          { name: "3D Interactive Homepage", description: "Globe with skill points and particle effects", implemented: true, priority: "high" },
          { name: "Real-time Collaboration", description: "Socket.IO powered collaborative features", implemented: true, priority: "high" },
          { name: "Adventure Map", description: "Interactive project showcase map", implemented: false, priority: "high" },
          { name: "Blog Timeline", description: "Time machine style blog interface", implemented: false, priority: "medium" }
        ],
        displaySettings: {
          featured: true,
          showInPortfolio: true,
          sortOrder: 1,
          backgroundColor: "#1a1a2e",
          textColor: "#ffffff",
          accentColor: "#4f46e5"
        }
      },
      {
        name: "E-commerce Platform",
        slug: "ecommerce-platform",
        description: "A full-stack e-commerce solution with advanced features including real-time inventory management, AI-powered recommendations, and seamless payment integration.",
        shortDescription: "Modern e-commerce platform with AI recommendations",
        techStack: [
          { name: "Next.js", category: "frontend", proficiency: "expert", color: "#000000" },
          { name: "TypeScript", category: "frontend", proficiency: "expert", color: "#3178C6" },
          { name: "PostgreSQL", category: "database", proficiency: "advanced", color: "#336791" },
          { name: "Stripe", category: "other", proficiency: "advanced", color: "#635BFF" },
          { name: "Docker", category: "devops", proficiency: "intermediate", color: "#2496ED" }
        ],
        category: "web-app",
        status: "completed",
        githubUrl: "https://github.com/username/ecommerce-platform",
        liveUrl: "https://shop.example.com",
        islandPosition: {
          x: 75,
          y: 60,
          size: "medium",
          theme: "tropical"
        },
        demoConfig: {
          type: "interactive-component",
          interactiveFeatures: [
            {
              name: "Shopping Cart Simulation",
              description: "Experience the shopping flow with demo products",
              action: "shopping-demo"
            }
          ]
        },
        features: [
          { name: "Product Catalog", description: "Searchable product listings with filters", implemented: true, priority: "critical" },
          { name: "Shopping Cart", description: "Real-time cart updates and management", implemented: true, priority: "critical" },
          { name: "Payment Processing", description: "Secure Stripe integration", implemented: true, priority: "critical" },
          { name: "AI Recommendations", description: "Machine learning powered product suggestions", implemented: true, priority: "medium" }
        ],
        displaySettings: {
          featured: true,
          showInPortfolio: true,
          sortOrder: 2,
          backgroundColor: "#f8fafc",
          textColor: "#1e293b",
          accentColor: "#059669"
        }
      },
      {
        name: "Real-time Chat Application",
        slug: "realtime-chat-app",
        description: "A modern chat application with real-time messaging, file sharing, video calls, and advanced moderation features. Built for scalability and performance.",
        shortDescription: "Feature-rich real-time chat with video calls",
        techStack: [
          { name: "React", category: "frontend", proficiency: "expert", color: "#61DAFB" },
          { name: "Socket.IO", category: "backend", proficiency: "expert", color: "#010101" },
          { name: "WebRTC", category: "other", proficiency: "advanced", color: "#FF6B6B" },
          { name: "Redis", category: "database", proficiency: "advanced", color: "#DC382D" },
          { name: "AWS S3", category: "devops", proficiency: "intermediate", color: "#FF9900" }
        ],
        category: "web-app",
        status: "completed",
        githubUrl: "https://github.com/username/chat-app",
        liveUrl: "https://chat.example.com",
        islandPosition: {
          x: 25,
          y: 75,
          size: "medium",
          theme: "mystical"
        },
        features: [
          { name: "Real-time Messaging", description: "Instant message delivery with Socket.IO", implemented: true, priority: "critical" },
          { name: "File Sharing", description: "Upload and share files securely", implemented: true, priority: "high" },
          { name: "Video Calls", description: "WebRTC powered video communication", implemented: true, priority: "high" },
          { name: "Message Encryption", description: "End-to-end encryption for privacy", implemented: false, priority: "medium" }
        ],
        displaySettings: {
          featured: false,
          showInPortfolio: true,
          sortOrder: 3,
          backgroundColor: "#7c3aed",
          textColor: "#ffffff",
          accentColor: "#a855f7"
        }
      }
    ];
    
    await ProjectShowcase.insertMany(projects);
    console.log('Projects seeded successfully');
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
};

const seedAchievements = async () => {
  try {
    // Clear existing achievements
    await AchievementDefinition.deleteMany({});
    
    const achievements = [
      {
        id: "first-visit",
        name: "Welcome Explorer",
        description: "Welcome to the portfolio! You've taken your first step into this interactive world.",
        category: "exploration",
        icon: "👋",
        badgeColor: "#10B981",
        rarity: "common",
        points: 5,
        requirements: new Map([["visits", 1]]),
        unlockMessage: "Welcome to the adventure! Explore more to unlock additional achievements."
      },
      {
        id: "skill-explorer",
        name: "Skill Explorer",
        description: "Interact with 5 different skill points on the 3D globe.",
        category: "interaction",
        icon: "🎯",
        badgeColor: "#3B82F6",
        rarity: "common",
        points: 10,
        requirements: new Map([["skillInteractions", 5]]),
        unlockMessage: "You're getting the hang of this! Keep exploring to discover more skills."
      },
      {
        id: "globe-master",
        name: "Globe Master",
        description: "Master of the skill globe! You've interacted with all available skill points.",
        category: "completion",
        icon: "🌍",
        badgeColor: "#8B5CF6",
        rarity: "rare",
        points: 25,
        requirements: new Map([["allSkillsInteracted", true]]),
        unlockMessage: "Impressive! You've mastered the skill globe. You're a true explorer!"
      },
      {
        id: "project-adventurer",
        name: "Project Adventurer",
        description: "Explore 3 different project islands on the adventure map.",
        category: "exploration",
        icon: "🏝️",
        badgeColor: "#F59E0B",
        rarity: "uncommon",
        points: 15,
        requirements: new Map([["projectsExplored", 3]]),
        unlockMessage: "You're becoming quite the adventurer! Each project has its own story to tell."
      },
      {
        id: "code-collaborator",
        name: "Code Collaborator",
        description: "Participate in a collaborative coding session with other visitors.",
        category: "collaboration",
        icon: "👥",
        badgeColor: "#EF4444",
        rarity: "uncommon",
        points: 20,
        requirements: new Map([["collaborativeSessions", 1]]),
        unlockMessage: "Teamwork makes the dream work! You've experienced the power of collaboration."
      },
      {
        id: "blog-scholar",
        name: "Blog Scholar",
        description: "Read 5 blog posts and complete their challenges.",
        category: "learning",
        icon: "📚",
        badgeColor: "#06B6D4",
        rarity: "uncommon",
        points: 30,
        requirements: new Map([["blogPostsRead", 5], ["challengesCompleted", 5]]),
        unlockMessage: "Knowledge is power! You're well on your way to becoming an expert."
      },
      {
        id: "chat-master",
        name: "Chat Master",
        description: "Have an engaging conversation with the AI chatbot (send 10 messages).",
        category: "interaction",
        icon: "💬",
        badgeColor: "#84CC16",
        rarity: "common",
        points: 15,
        requirements: new Map([["chatMessages", 10]]),
        unlockMessage: "Great conversation! The AI enjoyed chatting with you."
      },
      {
        id: "speed-runner",
        name: "Speed Runner",
        description: "Complete the entire portfolio tour in under 10 minutes.",
        category: "special",
        icon: "⚡",
        badgeColor: "#F97316",
        rarity: "rare",
        points: 40,
        requirements: new Map([["tourCompleted", true], ["tourTime", 600]]), // 600 seconds = 10 minutes
        unlockMessage: "Lightning fast! You've set a new record for portfolio exploration."
      },
      {
        id: "night-owl",
        name: "Night Owl",
        description: "Visit the portfolio between midnight and 6 AM.",
        category: "special",
        icon: "🦉",
        badgeColor: "#6366F1",
        rarity: "uncommon",
        points: 10,
        requirements: new Map([["nightVisit", true]]),
        unlockMessage: "Burning the midnight oil? Dedication like yours is admirable!"
      },
      {
        id: "perfectionist",
        name: "Perfectionist",
        description: "Complete all challenges with 100% accuracy on first try.",
        category: "completion",
        icon: "💎",
        badgeColor: "#EC4899",
        rarity: "epic",
        points: 50,
        requirements: new Map([["perfectChallenges", 5]]),
        unlockMessage: "Flawless execution! Your attention to detail is remarkable."
      },
      {
        id: "legend",
        name: "Portfolio Legend",
        description: "Unlock all other achievements and reach level 10.",
        category: "completion",
        icon: "👑",
        badgeColor: "#FBBF24",
        rarity: "legendary",
        points: 100,
        requirements: new Map([["level", 10], ["allAchievements", true]]),
        unlockMessage: "You are now a Portfolio Legend! Thank you for this incredible journey.",
        prerequisites: ["first-visit", "skill-explorer", "globe-master", "project-adventurer", "code-collaborator", "blog-scholar", "chat-master", "speed-runner", "night-owl", "perfectionist"]
      }
    ];
    
    await AchievementDefinition.insertMany(achievements);
    console.log('Achievements seeded successfully');
  } catch (error) {
    console.error('Error seeding achievements:', error);
  }
};

const runSeeds = async () => {
  try {
    console.log('Starting MongoDB seeding...');
    await seedBlogPosts();
    await seedProjects();
    await seedAchievements();
    console.log('All MongoDB seeds completed successfully!');
  } catch (error) {
    console.error('Error running seeds:', error);
  }
};

module.exports = {
  seedBlogPosts,
  seedProjects,
  seedAchievements,
  runSeeds
};