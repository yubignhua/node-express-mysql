const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    
    let query = {};
    if (featured === 'true') {
      query.featured = true;
    }

    const projects = await Project.find(query).sort({ featured: -1, createdAt: -1 });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Project fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

// POST /api/projects/:id/demo-interaction
router.post('/:id/demo-interaction', async (req, res) => {
  try {
    const { interactionType, data } = req.body;
    const projectId = req.params.id;

    // Log interaction for analytics (in a real app, you'd store this)
    console.log(`Demo interaction: ${interactionType} for project ${projectId}`, data);

    // Return mock interaction result based on type
    let result = {};
    
    switch (interactionType) {
      case 'shopping-cart':
        result = {
          cartItems: data.items || [],
          total: (data.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0),
          inventory: Math.floor(Math.random() * 100) + 1
        };
        break;
      
      case 'api-test':
        result = {
          status: 'success',
          responseTime: Math.random() * 200 + 50,
          data: { message: 'API call successful', timestamp: new Date().toISOString() }
        };
        break;
      
      case 'performance-test':
        result = {
          loadTime: Math.random() * 1000 + 500,
          memoryUsage: Math.random() * 50 + 20,
          score: Math.floor(Math.random() * 40) + 60
        };
        break;
      
      default:
        result = { message: 'Interaction recorded successfully' };
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Demo interaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process demo interaction'
    });
  }
});

// GET /api/projects/map/islands
router.get('/map/islands', async (req, res) => {
  try {
    const projects = await Project.find({}, 'name description techStack islandPosition githubUrl demoUrl featured');
    
    // Transform projects into island format for the adventure map
    const islands = projects.map(project => ({
      id: project._id,
      name: project.name,
      description: project.description,
      position: project.islandPosition,
      techStack: project.techStack,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      featured: project.featured,
      size: project.featured ? 'large' : 'medium',
      color: project.featured ? '#FFD700' : '#00f5ff'
    }));

    res.json({
      success: true,
      data: islands
    });
  } catch (error) {
    console.error('Islands fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project islands'
    });
  }
});

module.exports = router;