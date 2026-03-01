// Verification script for MongoDB and OpenRouter setup
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

console.log('🚀 Verifying Think Stack Setup\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`OPENROUTER_API_KEY: ${process.env.OPENROUTER_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`OPENROUTER_API_BASE: ${process.env.OPENROUTER_API_BASE || 'Using default'}`);
console.log(`PORT: ${process.env.PORT || '5000'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// MongoDB connection test
async function testMongoDB() {
  console.log('\n🔍 Testing MongoDB Connection...');
  
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.log('❌ DATABASE_URL is not set');
    console.log('💡 Please add to your .env file:');
    console.log('   DATABASE_URL=mongodb://localhost:27017/thinkstack');
    return false;
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db();
    await db.admin().ping();
    
    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Database: ${db.databaseName}`);
    
    // Test basic operations
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne({ 
      test: 'mongodb_connection', 
      timestamp: new Date().toISOString(),
      status: 'active'
    });
    
    const result = await testCollection.findOne({ test: 'mongodb_connection' });
    console.log('✅ MongoDB read/write test passed');
    
    // Clean up
    await testCollection.deleteOne({ test: 'mongodb_connection' });
    await client.close();
    
    return true;
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('💡 Make sure MongoDB is running on the specified host');
    return false;
  }
}

// OpenRouter API test
async function testOpenRouter() {
  console.log('\n🤖 Testing OpenRouter API...');
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('❌ OPENROUTER_API_KEY is not set');
    console.log('💡 Please add to your .env file:');
    console.log('   OPENROUTER_API_KEY=your_actual_openrouter_api_key');
    console.log('   OPENROUTER_API_BASE=https://openrouter.ai/api/v1');
    return false;
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: process.env.OPENROUTER_API_BASE || "https://openrouter.ai/api/v1",
    });

    console.log('🔄 Testing OpenRouter API call...');
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'API test successful' in exactly 3 words." }
      ],
      max_tokens: 10,
    });

    console.log('✅ OpenRouter API successful!');
    console.log('🤖 Response:', response.choices[0].message.content.trim());
    
    return true;
  } catch (error) {
    console.log('❌ OpenRouter API failed:', error.message);
    console.log('💡 Check your API key and network connection');
    return false;
  }
}

// Main verification
async function main() {
  console.log('🔧 Required Setup:');
  console.log('1. MongoDB server running on localhost:27017');
  console.log('2. OpenRouter API key from https://openrouter.ai/');
  console.log('3. .env file with proper configuration\n');
  
  const mongoSuccess = await testMongoDB();
  const openrouterSuccess = await testOpenRouter();
  
  console.log('\n📊 Verification Results:');
  console.log(`MongoDB: ${mongoSuccess ? '✅ CONNECTED' : '❌ FAILED'}`);
  console.log(`OpenRouter: ${openrouterSuccess ? '✅ CONNECTED' : '❌ FAILED'}`);
  
  if (mongoSuccess && openrouterSuccess) {
    console.log('\n🎉 Perfect! Your setup is complete and ready to run.');
    console.log('\n🚀 Start your application with: npm run dev');
  } else {
    console.log('\n⚠️  Setup incomplete. Please address the issues above.');
  }
  
  process.exit(mongoSuccess && openrouterSuccess ? 0 : 1);
}

main().catch(error => {
  console.error('💥 Verification script failed:', error);
  process.exit(1);
});
