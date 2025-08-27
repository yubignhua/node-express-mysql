/**
 * Setup script for blog functionality
 * Creates tables and seeds sample data
 */

const app = require('../index');
const { seedBlogPosts } = require('../seeds/blogSeeds');

async function setupBlog() {
  try {
    console.log('Setting up blog functionality...');
    
    // Wait for app to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get database instance
    const db = app.db;
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    console.log('Database connected successfully');
    
    // Sync database (create tables)
    await db.sequelize.sync({ force: false });
    console.log('Database tables synchronized');
    
    // Seed blog posts
    await seedBlogPosts(db);
    
    console.log('Blog setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Blog setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupBlog();