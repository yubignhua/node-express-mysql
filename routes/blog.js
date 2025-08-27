const express = require('express');
const router = express.Router();

// Get database models
let BlogPost = null;

// Middleware to ensure database connection
router.use((req, res, next) => {
  if (!BlogPost && req.app.locals.db && req.app.locals.db.models) {
    BlogPost = req.app.locals.db.models.BlogPost;
  }
  
  if (!BlogPost) {
    return res.status(500).json({
      success: false,
      error: 'Database not initialized'
    });
  }
  
  next();
});

// GET /api/blog/posts
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, year, month } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {
      status: 'published'
    };
    
    // Filter by tag if provided
    if (tag) {
      whereClause.tags = {
        [BlogPost.sequelize.Sequelize.Op.contains]: [tag]
      };
    }
    
    // Filter by year/month for timeline navigation
    if (year) {
      const startDate = new Date(year, month ? month - 1 : 0, 1);
      const endDate = month 
        ? new Date(year, month, 0, 23, 59, 59) 
        : new Date(year, 11, 31, 23, 59, 59);
      
      whereClause.published_at = {
        [BlogPost.sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    const { count, rows: posts } = await BlogPost.findAndCountAll({
      where: whereClause,
      order: [['published_at', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(limit),
      attributes: { exclude: ['content'] } // Exclude full content for list view
    });

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Blog posts fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts'
    });
  }
});

// GET /api/blog/posts/:slug
router.get('/posts/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findBySlug(req.params.slug);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Blog post fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog post'
    });
  }
});

// POST /api/blog/challenge/validate
router.post('/challenge/validate', async (req, res) => {
  try {
    const { postId, answer } = req.body;
    
    const post = await BlogPost.findByPk(postId);
    if (!post || !post.challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Increment attempt count
    await post.incrementChallengeAttempts();

    const isCorrect = answer.toLowerCase().trim() === post.challenge.answer.toLowerCase().trim();
    
    if (isCorrect) {
      // Increment success count
      await post.incrementChallengeSuccesses();
    }

    res.json({
      success: true,
      data: {
        correct: isCorrect,
        hint: !isCorrect ? post.challenge.hint : null
      }
    });
  } catch (error) {
    console.error('Challenge validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate challenge'
    });
  }
});

// POST /api/blog/code-execution
router.post('/code-execution', async (req, res) => {
  try {
    const { postId, code, language } = req.body;
    
    // Increment code execution count
    if (postId) {
      const post = await BlogPost.findByPk(postId);
      if (post) {
        await post.incrementCodeExecutions();
      }
    }

    // In a real implementation, you would execute the code in a sandboxed environment
    // For now, just return a mock result
    const mockResult = {
      output: `// Code executed successfully!\n// Language: ${language}\n// Lines: ${code.split('\n').length}`,
      executionTime: Math.random() * 100 + 50, // Mock execution time
      success: true
    };

    res.json({
      success: true,
      data: mockResult
    });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute code'
    });
  }
});

// GET /api/blog/tags
router.get('/tags', async (req, res) => {
  try {
    const posts = await BlogPost.findAll({
      where: { status: 'published' },
      attributes: ['tags']
    });

    // Count tag occurrences
    const tagCounts = {};
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Convert to array and sort by count
    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Tags fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tags'
    });
  }
});

// GET /api/blog/timeline - Get posts grouped by year/month for timeline
router.get('/timeline', async (req, res) => {
  try {
    const posts = await BlogPost.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'slug', 'published_at', 'excerpt', 'tags'],
      order: [['published_at', 'DESC']]
    });

    // Group posts by year and month
    const timeline = {};
    posts.forEach(post => {
      const date = new Date(post.published_at);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      if (!timeline[year]) {
        timeline[year] = {};
      }
      if (!timeline[year][month]) {
        timeline[year][month] = [];
      }
      
      timeline[year][month].push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        published_at: post.published_at,
        excerpt: post.excerpt,
        tags: post.tags
      });
    });

    res.json({
      success: true,
      data: timeline
    });
  } catch (error) {
    console.error('Timeline fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch timeline'
    });
  }
});

module.exports = router;