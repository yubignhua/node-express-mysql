/**
 * Migration script to add role column to Users table
 * Run with: node seeds/add-role-column.js
 */

require('dotenv').config();
const Sequelize = require('sequelize');

// Load config
const config = require('../config.development.js');
const sequelize = new Sequelize(
  config.db,
  config.username,
  config.password,
  config.params
);

async function addRoleColumn() {
  try {
    console.log('Adding role column to Users table...');
    
    // Add role column to Users table
    const query = `
      ALTER TABLE Users 
      ADD COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user' 
      AFTER email
    `;
    
    await sequelize.query(query);
    
    console.log('Role column added successfully!');
    
    // Update any existing users to have 'user' role
    await sequelize.query(`
      UPDATE Users 
      SET role = 'user' 
      WHERE role IS NULL
    `);
    
    console.log('Existing users updated with default role.');
    
    process.exit(0);
  } catch (error) {
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
      console.log('Role column already exists.');
      process.exit(0);
    }
    console.error('Error adding role column:', error);
    process.exit(1);
  }
}

addRoleColumn();