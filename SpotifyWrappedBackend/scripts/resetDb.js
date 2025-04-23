import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function resetDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the users collection
    await mongoose.connection.db.dropCollection('users');
    console.log('Dropped users collection');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database reset complete');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetDatabase();
