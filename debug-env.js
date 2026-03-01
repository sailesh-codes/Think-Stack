// Debug environment variable loading
import { config } from 'dotenv';
import fs from 'fs';

console.log('🔍 Debugging Environment Variables');
console.log('Current working directory:', process.cwd());

// Load dotenv
console.log('dotenv package loaded');
const result = config({ path: '.env' });
console.log('dotenv config result:', result);

console.log('DATABASE_URL after dotenv:', process.env.DATABASE_URL);
console.log('OPENROUTER_API_KEY after dotenv:', process.env.OPENROUTER_API_KEY ? '✅ Set' : '❌ Missing');
console.log('OPENROUTER_API_BASE after dotenv:', process.env.OPENROUTER_API_BASE || 'Using default');

// Check if .env file exists and is readable
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  console.log('.env file exists and is readable');
  console.log('First few lines:', envContent.split('\n').slice(0, 5).join('\n'));
} catch (error) {
  console.error('Error reading .env file:', error.message);
}
