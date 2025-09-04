/**
 * Seed script to create admin user
 * Run with: node seeds/admin-user.js
 */

require('dotenv').config();
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

// Load config
const config = require('../config.development.js');
const sequelize = new Sequelize(
  config.db,
  config.username,
  config.password,
  config.params
);

// Load models
const models = {};
const modelsDir = path.join(__dirname, '../models');
if (fs.existsSync(modelsDir)) {
  fs.readdirSync(modelsDir).forEach(file => {
    if (file.endsWith('.js')) {
      const modelPath = path.join(modelsDir, file);
      const model = require(modelPath)(sequelize, Sequelize.DataTypes);
      models[model.name] = model;
    }
  });
}

const Users = models.Users;

async function createAdminUser() {
  try {
    // Sync database
    await sequelize.sync();
    
    // Check if admin user already exists
    const existingAdmin = await Users.findOne({
      where: {
        [Sequelize.Op.or]: [
          { name: 'admin' },
          { email: 'admin@example.com' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.name);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await Users.create({
      name: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed by the model hook
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log('Username:', adminUser.name);
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();