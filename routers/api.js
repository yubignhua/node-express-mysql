/**
 * API Routes Router
 * Mounts all API routes from the routes directory
 */

module.exports = (app) => {
    // Mount blog routes
    const blogRoutes = require('../routes/blog');
    app.use('/api/blog', blogRoutes);
    
    // Mount project routes
    const projectRoutes = require('../routes/projects');
    app.use('/api/projects', projectRoutes);
    
    // Mount portfolio routes
    const portfolioRoutes = require('../routes/portfolio');
    app.use('/api/portfolio', portfolioRoutes);
    
    // Mount AI routes
    const aiRoutes = require('../routes/ai');
    app.use('/api/ai', aiRoutes);
    
    // Mount GitHub routes
    const githubRoutes = require('../routes/github');
    app.use('/api/github', githubRoutes);
    
    // Mount particles routes
    const particlesRoutes = require('../routes/particles');
    app.use('/api/particles', particlesRoutes);
    
    console.log('API routes mounted successfully');
};