const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/gearguard';

async function test() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

test();
