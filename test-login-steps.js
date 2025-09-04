// Test login step by step
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

async function testLoginStepByStep() {
  try {
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    console.log('2. Finding admin user...');
    const user = await Users.findOne({
      where: {
        [Sequelize.Op.or]: [
          { name: 'admin' },
          { email: 'admin@example.com' }
        ]
      }
    });
    
    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    
    console.log('3. Testing password verification...');
    const testPassword = 'admin123';
    const isPasswordValid = Users.isPassword(user.password, testPassword);
    console.log('Password verification result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password verification failed');
      return;
    }
    
    console.log('✅ Password verification successful');
    
    console.log('4. Testing JWT token generation...');
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'asdfsafsafsafsafsafsafsafd',
      { expiresIn: '24h' }
    );
    
    console.log('✅ JWT token generated successfully');
    console.log('Token:', token.substring(0, 50) + '...');
    
    console.log('5. Testing JWT token verification...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'asdfsafsafsafsafsafsafsafd');
    console.log('✅ JWT token verified successfully');
    console.log('Decoded token:', decoded);
    
    console.log('🎉 All login steps passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  process.exit(0);
}

testLoginStepByStep();