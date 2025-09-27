import dotenv from 'dotenv';
import mongoose from 'mongoose';
import aiService from './src/services/aiService.js';

dotenv.config();

async function testAI() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Testing AI Service...');
    await aiService.initialize();
    
    console.log('Testing query processing...');
    const result = await aiService.processQuery("Am I eligible for PM-KISAN scheme?");
    
    console.log('AI Service Test Result:');
    console.log(JSON.stringify(result, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testAI();
