const express = require('express');
const aiService = require('../services/aiService');
const router = express.Router();

// POST /api/ai/code-suggestion
router.post('/code-suggestion', async (req, res) => {
  try {
    const { context, language } = req.body;
    
    if (!context) {
      return res.status(400).json({
        success: false,
        error: 'Context is required for code suggestions'
      });
    }

    const suggestion = await aiService.generateCodeSuggestion(`${language}: ${context}`);

    res.json({
      success: true,
      data: {
        suggestion,
        context,
        language,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI code suggestion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate code suggestion'
    });
  }
});

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const response = await aiService.processChatMessage(message);

    res.json({
      success: true,
      data: {
        response,
        conversationId: conversationId || `conv_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
});

// POST /api/ai/project-recommendation
router.post('/project-recommendation', async (req, res) => {
  try {
    const { skills, interests } = req.body;
    
    // Simple recommendation algorithm based on skills
    const recommendations = [];
    
    if (skills.includes('react') || skills.includes('frontend')) {
      recommendations.push({
        title: 'Interactive Dashboard',
        description: 'Build a real-time data visualization dashboard',
        difficulty: 'intermediate',
        technologies: ['React', 'D3.js', 'WebSocket'],
        estimatedTime: '2-3 weeks'
      });
    }
    
    if (skills.includes('nodejs') || skills.includes('backend')) {
      recommendations.push({
        title: 'Real-time Chat Application',
        description: 'Create a scalable chat system with Socket.IO',
        difficulty: 'intermediate',
        technologies: ['Node.js', 'Socket.IO', 'MongoDB'],
        estimatedTime: '1-2 weeks'
      });
    }
    
    if (skills.includes('threejs') || skills.includes('3d')) {
      recommendations.push({
        title: '3D Portfolio Showcase',
        description: 'Design an immersive 3D experience for your work',
        difficulty: 'advanced',
        technologies: ['Three.js', 'React Three Fiber', 'WebGL'],
        estimatedTime: '3-4 weeks'
      });
    }

    // Default recommendation if no specific skills match
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Full-Stack Todo Application',
        description: 'A complete CRUD application with authentication',
        difficulty: 'beginner',
        technologies: ['React', 'Node.js', 'MongoDB'],
        estimatedTime: '1 week'
      });
    }

    res.json({
      success: true,
      data: {
        recommendations,
        basedOn: { skills, interests },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Project recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate project recommendations'
    });
  }
});

module.exports = router;