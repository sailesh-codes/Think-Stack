// Test script to verify MongoDB and OpenRouter connections
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

async function testMongoDB() {
  console.log('🔍 Testing MongoDB connection...');
  
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return false;
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    // Test database operations
    const db = client.db();
    await db.admin().ping();
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📁 Collections: ${collections.map(c => c.name).join(', ')}`);
    
    // Test a simple operation
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    const result = await testCollection.findOne({ test: 'connection' });
    console.log('✅ MongoDB read/write test passed:', result);
    
    // Clean up
    await testCollection.deleteOne({ test: 'connection' });
    await client.close();
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

async function testOpenRouter() {
  console.log('\n🤖 Testing OpenRouter API connection...');
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseURL = process.env.OPENROUTER_API_BASE;
  
  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not found in environment variables');
    return false;
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL || "https://openrouter.ai/api/v1",
    });

    // Test API with a simple request
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'API test successful' in exactly 3 words." }
      ],
      max_tokens: 10,
    });

    console.log('✅ OpenRouter API connected successfully!');
    console.log('🤖 Response:', response.choices[0].message.content.trim());
    
    return true;
  } catch (error) {
    console.error('❌ OpenRouter API connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Think Stack Database and API Connections\n');
  
  const mongoSuccess = await testMongoDB();
  const openrouterSuccess = await testOpenRouter();
  
  console.log('\n📋 Test Results:');
  console.log(`MongoDB: ${mongoSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`OpenRouter: ${openrouterSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  if (mongoSuccess && openrouterSuccess) {
    console.log('\n🎉 All connections are working! Your application should run successfully.');
  } else {
    console.log('\n⚠️  Some connections failed. Please check your configuration.');
  }
  
  process.exit(mongoSuccess && openrouterSuccess ? 0 : 1);
}

main().catch(console.error);
