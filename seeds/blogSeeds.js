/**
 * Blog Posts MySQL Seeds
 * Sample data for testing the blog timeline feature
 */

const sampleBlogPosts = [
  {
    title: "Building Interactive 3D Experiences with React Three Fiber",
    slug: "building-interactive-3d-experiences-react-three-fiber",
    content: `
      <p>Creating immersive 3D experiences on the web has never been more accessible thanks to React Three Fiber. In this post, we'll explore how to build interactive 3D scenes that respond to user input and create engaging visual experiences.</p>
      
      <h2>Getting Started with React Three Fiber</h2>
      <p>React Three Fiber is a React renderer for Three.js that allows us to build 3D scenes using familiar React patterns. It provides a declarative way to create complex 3D graphics while maintaining the component-based architecture we love in React.</p>
      
      <h2>Creating Your First 3D Scene</h2>
      <p>Let's start by creating a simple rotating cube that responds to mouse interactions. This will demonstrate the basic concepts of scene setup, geometry creation, and animation loops.</p>
      
      <h2>Adding Interactivity</h2>
      <p>The real magic happens when we add user interactions. We'll implement mouse controls, hover effects, and click handlers that make our 3D objects feel alive and responsive.</p>
      
      <h2>Performance Optimization</h2>
      <p>3D graphics can be resource-intensive, so we'll cover essential optimization techniques including level-of-detail (LOD) systems, frustum culling, and efficient material usage.</p>
    `,
    excerpt: "Learn how to create stunning interactive 3D experiences using React Three Fiber, from basic scene setup to advanced optimization techniques.",
    code_examples: [
      {
        language: "javascript",
        code: `import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box args={[1, 1, 1]}>
        <meshStandardMaterial color="hotpink" />
      </Box>
      <OrbitControls />
    </Canvas>
  )
}`,
        description: "Basic React Three Fiber scene with a rotating cube and orbit controls"
      },
      {
        language: "javascript",
        code: `const [hovered, setHovered] = useState(false)

return (
  <Box
    args={[1, 1, 1]}
    onPointerOver={() => setHovered(true)}
    onPointerOut={() => setHovered(false)}
    scale={hovered ? 1.2 : 1}
  >
    <meshStandardMaterial color={hovered ? "orange" : "hotpink"} />
  </Box>
)`,
        description: "Adding hover interactions to 3D objects"
      }
    ],
    challenge: {
      question: "What React Three Fiber hook is used to access the Three.js renderer and scene objects?",
      answer: "useThree",
      hint: "It's a hook that gives you access to the three.js state and objects."
    },
    published_at: new Date('2024-01-15'),
    tags: ["React", "Three.js", "3D Graphics", "WebGL", "Frontend"],
    featured: true,
    status: "published"
  },
  {
    title: "Mastering WebSocket Real-time Communication",
    slug: "mastering-websocket-realtime-communication",
    content: `
      <p>Real-time communication is essential for modern web applications. Whether you're building a chat application, collaborative editor, or live dashboard, WebSockets provide the foundation for instant, bidirectional communication.</p>
      
      <h2>Understanding WebSocket Protocol</h2>
      <p>WebSockets establish a persistent connection between client and server, allowing both parties to send data at any time. This is a significant improvement over traditional HTTP polling methods.</p>
      
      <h2>Implementing Socket.IO</h2>
      <p>Socket.IO provides a robust abstraction over WebSockets with automatic fallbacks, room management, and built-in error handling. We'll explore how to set up both server and client implementations.</p>
      
      <h2>Building Real-time Features</h2>
      <p>From live cursors to collaborative editing, we'll implement several real-time features that demonstrate the power of WebSocket communication in creating engaging user experiences.</p>
    `,
    excerpt: "Deep dive into WebSocket technology and Socket.IO to build real-time features that keep users engaged and connected.",
    code_examples: [
      {
        language: "javascript",
        code: `// Server setup
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  socket.on('message', (data) => {
    socket.broadcast.emit('message', data)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})`,
        description: "Basic Socket.IO server setup with message broadcasting"
      },
      {
        language: "javascript",
        code: `// Client setup
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('message', (data) => {
  displayMessage(data)
})

const sendMessage = (message) => {
  socket.emit('message', message)
}`,
        description: "Client-side Socket.IO connection and event handling"
      }
    ],
    challenge: {
      question: "What Socket.IO method is used to send a message to all connected clients except the sender?",
      answer: "broadcast.emit",
      hint: "It's a method that sends to everyone but the current socket."
    },
    published_at: new Date('2024-02-10'),
    tags: ["WebSocket", "Socket.IO", "Real-time", "Node.js", "Backend"],
    featured: false,
    status: "published"
  },
  {
    title: "Advanced State Management with Zustand",
    slug: "advanced-state-management-zustand",
    content: `
      <p>State management doesn't have to be complex. Zustand offers a lightweight, flexible approach to managing application state without the boilerplate of traditional solutions.</p>
      
      <h2>Why Choose Zustand?</h2>
      <p>Zustand provides a simple API, excellent TypeScript support, and minimal bundle size. It's perfect for applications that need powerful state management without the complexity.</p>
      
      <h2>Creating Your First Store</h2>
      <p>We'll start with basic store creation and gradually build up to more complex patterns including middleware, persistence, and computed values.</p>
      
      <h2>Advanced Patterns</h2>
      <p>Explore advanced Zustand patterns including store slicing, middleware composition, and integration with React Suspense for optimal performance.</p>
    `,
    excerpt: "Discover the power of Zustand for state management - simple, flexible, and performant without the complexity of traditional solutions.",
    code_examples: [
      {
        language: "javascript",
        code: `import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))`,
        description: "Basic Zustand store with counter functionality"
      },
      {
        language: "javascript",
        code: `import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePersistedStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)`,
        description: "Zustand store with persistence middleware"
      }
    ],
    challenge: {
      question: "What Zustand middleware is used to automatically save store state to localStorage?",
      answer: "persist",
      hint: "It's a middleware that keeps your state even after page refresh."
    },
    published_at: new Date('2024-03-05'),
    tags: ["React", "State Management", "Zustand", "TypeScript", "Frontend"],
    featured: true,
    status: "published"
  },
  {
    title: "Building Responsive Animations with Framer Motion",
    slug: "building-responsive-animations-framer-motion",
    content: `
      <p>Animations bring life to user interfaces, but they need to be purposeful and performant. Framer Motion provides the tools to create smooth, responsive animations that enhance user experience.</p>
      
      <h2>Animation Fundamentals</h2>
      <p>Understanding the principles of good animation design is crucial. We'll cover timing, easing, and the importance of respecting user preferences for reduced motion.</p>
      
      <h2>Gesture-Based Interactions</h2>
      <p>Framer Motion excels at gesture handling. We'll implement drag interactions, hover effects, and touch-friendly animations that work across all devices.</p>
      
      <h2>Performance Optimization</h2>
      <p>Learn how to create animations that run at 60fps by leveraging the GPU and avoiding layout thrashing. We'll cover transform-based animations and proper use of will-change.</p>
    `,
    excerpt: "Master the art of web animations with Framer Motion - from basic transitions to complex gesture-based interactions.",
    code_examples: [
      {
        language: "javascript",
        code: `import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function AnimatedCard() {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
      className="card"
    >
      Content here
    </motion.div>
  )
}`,
        description: "Basic Framer Motion animation with variants"
      },
      {
        language: "javascript",
        code: `<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  whileDrag={{ scale: 1.1 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Draggable element
</motion.div>`,
        description: "Drag interactions with constraints and gesture animations"
      }
    ],
    challenge: {
      question: "What Framer Motion prop is used to define different animation states?",
      answer: "variants",
      hint: "It's an object that defines different animation configurations."
    },
    published_at: new Date('2024-01-28'),
    tags: ["Animation", "Framer Motion", "React", "UX", "Frontend"],
    featured: false,
    status: "published"
  },
  {
    title: "Database Design Patterns for Modern Applications",
    slug: "database-design-patterns-modern-applications",
    content: `
      <p>Effective database design is the foundation of scalable applications. We'll explore modern patterns that balance performance, maintainability, and flexibility.</p>
      
      <h2>Choosing the Right Database</h2>
      <p>SQL vs NoSQL isn't just about relational vs document storage. We'll examine when to use each approach and how to design schemas that grow with your application.</p>
      
      <h2>Indexing Strategies</h2>
      <p>Proper indexing can make the difference between millisecond and second response times. Learn how to design indexes that support your query patterns without bloating storage.</p>
      
      <h2>Caching Layers</h2>
      <p>Implement effective caching strategies using Redis and application-level caching to reduce database load and improve response times.</p>
    `,
    excerpt: "Learn modern database design patterns that scale from startup to enterprise, covering SQL, NoSQL, and hybrid approaches.",
    code_examples: [
      {
        language: "sql",
        code: `-- Optimized user posts query with proper indexing
CREATE INDEX idx_posts_user_published 
ON posts(user_id, published_at DESC) 
WHERE status = 'published';

SELECT p.*, u.username 
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id = ? 
  AND p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 10;`,
        description: "Efficient query with composite index for user posts"
      },
      {
        language: "javascript",
        code: `// Redis caching layer
const redis = require('redis')
const client = redis.createClient()

async function getCachedUser(userId) {
  const cached = await client.get(\`user:\${userId}\`)
  if (cached) return JSON.parse(cached)
  
  const user = await db.users.findById(userId)
  await client.setex(\`user:\${userId}\`, 3600, JSON.stringify(user))
  return user
}`,
        description: "Redis caching implementation with TTL"
      }
    ],
    challenge: {
      question: "What type of database index is most efficient for range queries on date columns?",
      answer: "B-tree",
      hint: "It's the default index type in most SQL databases, great for ordered data."
    },
    published_at: new Date('2024-02-22'),
    tags: ["Database", "SQL", "NoSQL", "Performance", "Backend"],
    featured: false,
    status: "published"
  }
];

async function seedBlogPosts(db) {
  try {
    console.log('Seeding blog posts...');
    
    // Check if BlogPost model exists
    if (!db.models.BlogPost) {
      console.error('BlogPost model not found. Make sure the model is loaded.');
      return;
    }
    
    // Clear existing blog posts
    await db.models.BlogPost.destroy({ where: {} });
    console.log('Cleared existing blog posts');
    
    // Insert sample blog posts
    for (const post of sampleBlogPosts) {
      await db.models.BlogPost.create(post);
      console.log(`Created blog post: ${post.title}`);
    }
    
    console.log(`Successfully seeded ${sampleBlogPosts.length} blog posts`);
  } catch (error) {
    console.error('Error seeding blog posts:', error);
    throw error;
  }
}

module.exports = {
  seedBlogPosts,
  sampleBlogPosts
};