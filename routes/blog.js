const express = require('express');
const router = express.Router();

// Get database models
let BlogPost = null;

// Middleware to ensure database connection
router.use((req, res, next) => {
  if (!BlogPost && req.app.db && req.app.db.models) {
    BlogPost = req.app.db.models.BlogPost;
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

// POST /api/blog/posts - Create new blog post
router.post('/posts', async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      tags = [],
      code_examples = [],
      challenge = null,
      status = 'draft',
      featured = false
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ where: { slug } });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        error: 'A post with this title already exists'
      });
    }

    // Create the post
    const post = await BlogPost.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      tags: Array.isArray(tags) ? tags : [],
      code_examples: Array.isArray(code_examples) ? code_examples : [],
      challenge,
      status,
      featured,
      published_at: status === 'published' ? new Date() : null
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Blog post creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create blog post'
    });
  }
});

// PUT /api/blog/posts/:id - Update existing blog post
router.put('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const {
      title,
      content,
      excerpt,
      tags,
      code_examples,
      challenge,
      status,
      featured
    } = req.body;

    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Update slug if title changed
    let slug = post.slug;
    if (title && title !== post.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if new slug already exists
      const existingPost = await BlogPost.findOne({ 
        where: { 
          slug,
          id: { [BlogPost.sequelize.Sequelize.Op.ne]: postId }
        }
      });
      if (existingPost) {
        return res.status(400).json({
          success: false,
          error: 'A post with this title already exists'
        });
      }
    }

    // Update the post
    const updatedPost = await post.update({
      title: title || post.title,
      slug,
      content: content || post.content,
      excerpt: excerpt || (content ? content.substring(0, 200) + '...' : post.excerpt),
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : []) : post.tags,
      code_examples: code_examples !== undefined ? (Array.isArray(code_examples) ? code_examples : []) : post.code_examples,
      challenge: challenge !== undefined ? challenge : post.challenge,
      status: status || post.status,
      featured: featured !== undefined ? featured : post.featured,
      published_at: status === 'published' && post.status !== 'published' ? new Date() : post.published_at
    });

    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error('Blog post update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update blog post'
    });
  }
});

// DELETE /api/blog/posts/:id - Delete blog post
router.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    await post.destroy();

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Blog post deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete blog post'
    });
  }
});

// GET /api/blog/posts/:id/edit - Get post for editing (includes drafts)
router.get('/posts/:id/edit', async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Blog post fetch for edit error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog post for editing'
    });
  }
});

// GET /api/blog/drafts - Get all draft posts
router.get('/drafts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await BlogPost.findAndCountAll({
      where: { status: 'draft' },
      order: [['updated_at', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(limit)
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
    console.error('Draft posts fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch draft posts'
    });
  }
});

module.exports = router;