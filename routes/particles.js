const express = require('express');
const router = express.Router();

// GET /api/particles/random - Generate random particles
router.get('/random', (req, res) => {
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

// POST /api/particles/random - Generate random particles with body params
router.post('/random', (req, res) => {
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

// POST /api/particles/interaction - Handle particle interactions
router.post('/interaction', (req, res) => {
  try {
    const { skillId, position, timestamp } = req.body;
    
    // Generate interaction-specific particles
    const interactionParticles = Array.from({ length: 15 }, (_, i) => {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.5;
      const speed = 0.02 + Math.random() * 0.03;
      
      return {
        id: `interaction-${skillId}-${timestamp}-${i}`,
        position: [
          position[0] + Math.cos(angle) * radius * 0.2,
          position[1] + Math.sin(angle) * radius * 0.2,
          position[2] + (Math.random() - 0.5) * 0.2
        ],
        velocity: [
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          (Math.random() - 0.5) * speed
        ],
        color: ['#61dafb', '#3178c6', '#339933', '#ff6b6b'][Math.floor(Math.random() * 4)],
        size: Math.random() * 3 + 2,
        life: 2 + Math.random() * 2,
        maxLife: 2 + Math.random() * 2
      };
    });

    res.json({
      success: true,
      particles: interactionParticles,
      skillId,
      timestamp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process interaction'
    });
  }
});

module.exports = router;