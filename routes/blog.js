const express = require('express');
const BlogPost = require('../models/BlogPost');
const router = express.Router();

// GET /api/blog/posts
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content'); // Exclude full content for list view

    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
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
    const post = await BlogPost.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Increment view count
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } });

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
    
    const post = await BlogPost.findById(postId);
    if (!post || !post.challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Increment attempt count
    await BlogPost.findByIdAndUpdate(postId, { 
      $inc: { 'interactionStats.challengeAttempts': 1 } 
    });

    const isCorrect = answer.toLowerCase().trim() === post.challenge.answer.toLowerCase().trim();
    
    if (isCorrect) {
      // Increment success count
      await BlogPost.findByIdAndUpdate(postId, { 
        $inc: { 'interactionStats.challengeSuccesses': 1 } 
      });
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
      await BlogPost.findByIdAndUpdate(postId, { 
        $inc: { 'interactionStats.codeExecutions': 1 } 
      });
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
    const tags = await BlogPost.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    });
  } catch (error) {
    console.error('Tags fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tags'
    });
  }
});

module.exports = router;