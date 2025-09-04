// Debug script to check admin user data
require('dotenv').config();
const Sequelize = require('sequelize');

// Load config
const config = require('./config.development.js');
const sequelize = new Sequelize(
  config.db,
  config.username,
  config.password,
  config.params
);

// Load models
const models = {};
const fs = require('fs');
const path = require('path');
const modelsDir = path.join(__dirname, 'models');
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

async function debugAdminUser() {
  try {
    // Find admin user
    const admin = await Users.findOne({
      where: {
        [Sequelize.Op.or]: [
          { name: 'admin' },
          { email: 'admin@example.com' }
        ]
      }
    });
    
    if (admin) {
      console.log('Admin user found:');
      console.log('ID:', admin.id);
      console.log('Name:', admin.name);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Password (hashed):', admin.password);
      
      // Test password verification
      const bcrypt = require('bcrypt');
      const isPasswordValid = bcrypt.compareSync('admin123', admin.password);
      console.log('Password verification test:', isPasswordValid);
    } else {
      console.log('Admin user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Debug error:', error);
    process.exit(1);
  }
}

debugAdminUser();