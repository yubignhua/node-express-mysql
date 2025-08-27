const express = require('express');
const router = express.Router();

// Sample skills data
const skills = [
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    level: 95,
    position: [1.2, 0.5, 0.8],
    color: '#61DAFB',
    description: 'Building interactive UIs with React hooks and modern patterns'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    level: 90,
    position: [-1.0, 0.3, 0.6],
    color: '#339933',
    description: 'Server-side JavaScript with Express and real-time features'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Language',
    level: 88,
    position: [0.8, -0.7, 1.1],
    color: '#3178C6',
    description: 'Type-safe JavaScript development for scalable applications'
  },
  {
    id: 'threejs',
    name: 'Three.js',
    category: 'Graphics',
    level: 75,
    position: [-0.6, 1.0, -0.4],
    color: '#000000',
    description: '3D graphics and interactive visualizations in the browser'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Database',
    level: 85,
    position: [0.2, -1.2, 0.3],
    color: '#47A248',
    description: 'NoSQL database design and optimization'
  }
];

const skillCategories = [
  { id: 'frontend', name: 'Frontend', color: '#61DAFB' },
  { id: 'backend', name: 'Backend', color: '#339933' },
  { id: 'database', name: 'Database', color: '#47A248' },
  { id: 'graphics', name: 'Graphics', color: '#FF6B6B' },
  { id: 'language', name: 'Languages', color: '#3178C6' }
];

// GET /api/portfolio/skills
router.get('/skills', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        skills,
        categories: skillCategories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch skills data'
    });
  }
});

// GET /api/portfolio/achievements
router.get('/achievements', (req, res) => {
  try {
    const achievements = [
      {
        id: 'first-interaction',
        name: 'First Contact',
        description: 'Interacted with the 3D globe',
        icon: '🌍',
        unlocked: false
      },
      {
        id: 'skill-explorer',
        name: 'Skill Explorer',
        description: 'Clicked on 5 different skill points',
        icon: '🔍',
        unlocked: false
      },
      {
        id: 'project-navigator',
        name: 'Project Navigator',
        description: 'Visited 3 project islands',
        icon: '🗺️',
        unlocked: false
      },
      {
        id: 'code-collaborator',
        name: 'Code Collaborator',
        description: 'Used the collaborative code editor',
        icon: '👥',
        unlocked: false
      }
    ];

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements'
    });
  }
});

// POST /api/portfolio/unlock-achievement
router.post('/unlock-achievement', (req, res) => {
  try {
    const { achievementId, userId } = req.body;
    
    // In a real app, you'd save this to a database
    // For now, just return success
    res.json({
      success: true,
      data: {
        achievementId,
        unlockedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to unlock achievement'
    });
  }
});

// GET /api/portfolio/particle-data
router.get('/particle-data', (req, res) => {
  try {
    // Generate random particle data for animations
    const particleData = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      z: Math.random() * 200 - 100,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      size: Math.random() * 3 + 1,
      velocity: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      }
    }));

    res.json({
      success: true,
      data: particleData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate particle data'
    });
  }
});

// POST /api/portfolio/particles/random - Generate random particles for interactions
router.post('/particles/random', (req, res) => {
  try {
    const { count = 20 } = req.body;
    
    // Generate random particles in the format expected by the frontend
    const particles = Array.from({ length: count }, (_, i) => ({
      id: `api-particle-${Date.now()}-${i}`,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ],
      velocity: [
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03
      ],
      color: ['#3b82f6', '#8b5cf6', '#06d6a0', '#f72585', '#ffbe0b', '#ff6b6b'][Math.floor(Math.random() * 6)],
      size: Math.random() * 2 + 1,
      life: Math.random() * 4 + 2,
      maxLife: Math.random() * 4 + 2
    }));

    res.json(particles);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate random particles'
    });
  }
});

// GET /api/particles/random - Alternative endpoint for GET requests
router.get('/particles/random', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 20;
    
    // Generate random particles in the format expected by the frontend
    const particles = Array.from({ length: count }, (_, i) => ({
      id: `api-particle-${Date.now()}-${i}`,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ],
      velocity: [
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03
      ],
      color: ['#3b82f6', '#8b5cf6', '#06d6a0', '#f72585', '#ffbe0b', '#ff6b6b'][Math.floor(Math.random() * 6)],
      size: Math.random() * 2 + 1,
      life: Math.random() * 4 + 2,
      maxLife: Math.random() * 4 + 2
    }));

    res.json(particles);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate random particles'
    });
  }
});

module.exports = router;